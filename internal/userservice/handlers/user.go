package handlers

import (
	"net/http"
	"time"

	"enchanted-micro/internal/userservice/config"
	"enchanted-micro/internal/userservice/database"
	"enchanted-micro/internal/userservice/models"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type UserHandler struct {
	config *config.Config
}

func NewUserHandler(cfg *config.Config) *UserHandler {
	return &UserHandler{config: cfg}
}

// Register - Yeni kullanıcı kaydı
func (h *UserHandler) Register(c *gin.Context) {
	var req models.CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Şifreyi hash'le
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Şifre hash'lenemedi"})
		return
	}

	// Yeni user oluştur
	user := models.User{
		Username: req.Username,
		Password: string(hashedPassword),
		Email:    req.Email,
	}

	// Veritabanına kaydet
	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Kullanıcı adı veya email zaten kullanılıyor"})
		return
	}

	// Şifreyi response'dan çıkar
	user.Password = ""

	c.JSON(http.StatusCreated, gin.H{
		"message": "Kullanıcı başarıyla oluşturuldu",
		"user":    user,
	})
}

// Login - Kullanıcı girişi
func (h *UserHandler) Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Kullanıcıyı bul
	var user models.User
	if err := database.DB.Where("username = ?", req.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Geçersiz kullanıcı adı veya şifre"})
		return
	}

	// Şifreyi kontrol et
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Geçersiz kullanıcı adı veya şifre"})
		return
	}

	// JWT token oluştur
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":  user.ID,
		"username": user.Username,
		"exp":      time.Now().Add(time.Hour * 24).Unix(), // 24 saat geçerli
	})

	tokenString, err := token.SignedString([]byte(h.config.JWTSecret))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Token oluşturulamadı"})
		return
	}

	// Şifreyi response'dan çıkar
	user.Password = ""

	c.JSON(http.StatusOK, models.LoginResponse{
		Token: tokenString,
		User:  user,
	})
}

// GetProfile - Kullanıcı profili
func (h *UserHandler) GetProfile(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Kullanıcı bulunamadı"})
		return
	}

	userModel := user.(models.User)
	userModel.Password = "" // Şifreyi gizle

	c.JSON(http.StatusOK, gin.H{"user": userModel})
}

// UpdateProfile - Profil güncelleme
func (h *UserHandler) UpdateProfile(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Kullanıcı bulunamadı"})
		return
	}

	userModel := user.(models.User)

	var req struct {
		Email string `json:"email" binding:"email"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Email güncelle
	if req.Email != "" {
		userModel.Email = req.Email
	}

	if err := database.DB.Save(&userModel).Error; err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email zaten kullanılıyor"})
		return
	}

	userModel.Password = "" // Şifreyi gizle

	c.JSON(http.StatusOK, gin.H{
		"message": "Profil başarıyla güncellendi",
		"user":    userModel,
	})
}
