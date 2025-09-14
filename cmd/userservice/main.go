package main

import (
	"log"

	"enchanted-micro/internal/userservice/config"
	"enchanted-micro/internal/userservice/database"
	"enchanted-micro/internal/userservice/handlers"
	"enchanted-micro/internal/userservice/middleware"

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

	// User handler
	userHandler := handlers.NewUserHandler(cfg)

	// Public routes
	r.POST("/register", userHandler.Register)
	r.POST("/login", userHandler.Login)

	// Protected routes
	protected := r.Group("/")
	protected.Use(middleware.AuthMiddleware(cfg))
	{
		protected.GET("/profile", userHandler.GetProfile)
		protected.PUT("/profile", userHandler.UpdateProfile)
	}

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "service": "user-service"})
	})

	log.Printf("User Service %s portunda başlatılıyor...", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatal("Server başlatılamadı:", err)
	}
}
