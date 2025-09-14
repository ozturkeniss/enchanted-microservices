package main

import (
	"log"

	"enchanted-micro/internal/productservice/config"
	"enchanted-micro/internal/productservice/database"
	"enchanted-micro/internal/productservice/handlers"
	"enchanted-micro/internal/productservice/middleware"

	"github.com/gin-gonic/gin"
)

func main() {
	// Config yükle
	cfg := config.LoadConfig()

	// Database bağlantısı
	database.ConnectDB(cfg)

	// Gin router
	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Static files for uploads
	r.Static("/uploads", cfg.UploadPath)

	// Product handler
	productHandler := handlers.NewProductHandler(cfg)

	// Public routes
	r.GET("/products", productHandler.GetProducts)

	// Protected routes
	protected := r.Group("/")
	protected.Use(middleware.AuthMiddleware(cfg))
	{
		// Product CRUD
		protected.POST("/products", productHandler.CreateProduct)
		protected.GET("/my-products", productHandler.GetMyProducts)
		protected.PUT("/products/:id", productHandler.UpdateProduct)
		protected.DELETE("/products/:id", productHandler.DeleteProduct)
		
		// Image upload
		protected.POST("/products/:id/image", productHandler.UploadProductImage)
	}

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "service": "product-service"})
	})

	log.Printf("Product Service %s portunda başlatılıyor...", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatal("Server başlatılamadı:", err)
	}
}
