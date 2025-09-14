package handlers

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"enchanted-micro/internal/productservice/config"
	"enchanted-micro/internal/productservice/database"
	"enchanted-micro/internal/productservice/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ProductHandler struct {
	config *config.Config
}

func NewProductHandler(cfg *config.Config) *ProductHandler {
	return &ProductHandler{config: cfg}
}

// CreateProduct - Yeni ürün oluştur
func (h *ProductHandler) CreateProduct(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Kullanıcı bulunamadı"})
		return
	}

	var req models.CreateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Ürün oluştur
	product := models.Product{
		Title:       req.Title,
		Description: req.Description,
		Price:       req.Price,
		Category:    req.Category,
		UserID:      userID.(uint),
	}

	// Veritabanına kaydet
	if err := database.DB.Create(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ürün oluşturulamadı"})
		return
	}

	// Response oluştur
	response := models.ProductResponse{
		ID:          product.ID,
		Title:       product.Title,
		Description: product.Description,
		Price:       product.Price,
		ImageURL:    product.ImageURL,
		Category:    product.Category,
		UserID:      product.UserID,
		CreatedAt:   product.CreatedAt,
		UpdatedAt:   product.UpdatedAt,
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Ürün başarıyla oluşturuldu",
		"product": response,
	})
}

// UploadProductImage - Ürün resmi yükle
func (h *ProductHandler) UploadProductImage(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Kullanıcı bulunamadı"})
		return
	}

	productID := c.Param("id")
	
	// Ürünün kullanıcıya ait olup olmadığını kontrol et
	var product models.Product
	if err := database.DB.Where("id = ? AND user_id = ?", productID, userID).First(&product).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Ürün bulunamadı veya size ait değil"})
		return
	}

	// Dosya yükle
	file, header, err := c.Request.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Resim dosyası gerekli"})
		return
	}
	defer file.Close()

	// Dosya uzantısını kontrol et
	ext := strings.ToLower(filepath.Ext(header.Filename))
	allowedExts := []string{".jpg", ".jpeg", ".png", ".gif", ".webp"}
	if !contains(allowedExts, ext) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Geçersiz dosya formatı. Sadece jpg, jpeg, png, gif, webp kabul edilir"})
		return
	}

	// Upload klasörünü oluştur
	uploadDir := h.config.UploadPath
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Upload klasörü oluşturulamadı"})
		return
	}

	// Benzersiz dosya adı oluştur
	fileName := fmt.Sprintf("%s_%s%s", productID, uuid.New().String(), ext)
	filePath := filepath.Join(uploadDir, fileName)

	// Dosyayı kaydet
	dst, err := os.Create(filePath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Dosya kaydedilemedi"})
		return
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Dosya kopyalanamadı"})
		return
	}

	// Ürünün image_url'ini güncelle
	imageURL := fmt.Sprintf("/uploads/%s", fileName)
	if err := database.DB.Model(&product).Update("image_url", imageURL).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Resim URL'i güncellenemedi"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "Resim başarıyla yüklendi",
		"image_url": imageURL,
	})
}

// GetProducts - Tüm ürünleri getir (pagination ile)
func (h *ProductHandler) GetProducts(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	category := c.Query("category")

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	offset := (page - 1) * limit

	var products []models.Product
	var total int64

	query := database.DB.Model(&models.Product{})
	
	if category != "" {
		query = query.Where("category = ?", category)
	}

	// Toplam sayıyı al
	if err := query.Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ürünler sayılamadı"})
		return
	}

	// Ürünleri al
	if err := query.Offset(offset).Limit(limit).Order("created_at DESC").Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ürünler getirilemedi"})
		return
	}

	// Response oluştur
	var productResponses []models.ProductResponse
	for _, product := range products {
		productResponses = append(productResponses, models.ProductResponse{
			ID:          product.ID,
			Title:       product.Title,
			Description: product.Description,
			Price:       product.Price,
			ImageURL:    product.ImageURL,
			Category:    product.Category,
			UserID:      product.UserID,
			CreatedAt:   product.CreatedAt,
			UpdatedAt:   product.UpdatedAt,
		})
	}

	response := models.GetProductsResponse{
		Products: productResponses,
		Total:    total,
		Page:     page,
		Limit:    limit,
	}

	c.JSON(http.StatusOK, response)
}

// GetMyProducts - Kullanıcının kendi ürünlerini getir
func (h *ProductHandler) GetMyProducts(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Kullanıcı bulunamadı"})
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	offset := (page - 1) * limit

	var products []models.Product
	var total int64

	// Kullanıcının ürünlerini say
	if err := database.DB.Model(&models.Product{}).Where("user_id = ?", userID).Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ürünler sayılamadı"})
		return
	}

	// Kullanıcının ürünlerini al
	if err := database.DB.Where("user_id = ?", userID).Offset(offset).Limit(limit).Order("created_at DESC").Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ürünler getirilemedi"})
		return
	}

	// Response oluştur
	var productResponses []models.ProductResponse
	for _, product := range products {
		productResponses = append(productResponses, models.ProductResponse{
			ID:          product.ID,
			Title:       product.Title,
			Description: product.Description,
			Price:       product.Price,
			ImageURL:    product.ImageURL,
			Category:    product.Category,
			UserID:      product.UserID,
			CreatedAt:   product.CreatedAt,
			UpdatedAt:   product.UpdatedAt,
		})
	}

	response := models.GetProductsResponse{
		Products: productResponses,
		Total:    total,
		Page:     page,
		Limit:    limit,
	}

	c.JSON(http.StatusOK, response)
}

// UpdateProduct - Ürün güncelle
func (h *ProductHandler) UpdateProduct(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Kullanıcı bulunamadı"})
		return
	}

	productID := c.Param("id")
	
	// Ürünü bul
	var product models.Product
	if err := database.DB.Where("id = ? AND user_id = ?", productID, userID).First(&product).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Ürün bulunamadı veya size ait değil"})
		return
	}

	var req models.UpdateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Güncelleme yap
	updates := make(map[string]interface{})
	if req.Title != "" {
		updates["title"] = req.Title
	}
	if req.Description != "" {
		updates["description"] = req.Description
	}
	if req.Price > 0 {
		updates["price"] = req.Price
	}
	if req.Category != "" {
		updates["category"] = req.Category
	}

	if err := database.DB.Model(&product).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ürün güncellenemedi"})
		return
	}

	// Güncellenmiş ürünü getir
	database.DB.First(&product, productID)

	response := models.ProductResponse{
		ID:          product.ID,
		Title:       product.Title,
		Description: product.Description,
		Price:       product.Price,
		ImageURL:    product.ImageURL,
		Category:    product.Category,
		UserID:      product.UserID,
		CreatedAt:   product.CreatedAt,
		UpdatedAt:   product.UpdatedAt,
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Ürün başarıyla güncellendi",
		"product": response,
	})
}

// DeleteProduct - Ürün sil
func (h *ProductHandler) DeleteProduct(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Kullanıcı bulunamadı"})
		return
	}

	productID := c.Param("id")
	
	// Ürünü bul
	var product models.Product
	if err := database.DB.Where("id = ? AND user_id = ?", productID, userID).First(&product).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Ürün bulunamadı veya size ait değil"})
		return
	}

	// Resmi sil
	if product.ImageURL != "" {
		imagePath := filepath.Join(h.config.UploadPath, filepath.Base(product.ImageURL))
		if err := os.Remove(imagePath); err != nil {
			log.Printf("Resim silinemedi: %v", err)
		}
	}

	// Ürünü sil
	if err := database.DB.Delete(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ürün silinemedi"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Ürün başarıyla silindi"})
}

// Helper function
func contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}
