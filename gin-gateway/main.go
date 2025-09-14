package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// Service URLs
const (
	UserServiceURL    = "http://localhost:8080"
	ProductServiceURL = "http://localhost:8081"
)

// ProxyRequest proxies a request to the target service
func ProxyRequest(c *gin.Context, targetURL string) {
	// Create the full URL
	fullURL := targetURL + c.Request.URL.Path
	if c.Request.URL.RawQuery != "" {
		fullURL += "?" + c.Request.URL.RawQuery
	}

	// Create request body
	var body io.Reader
	if c.Request.Body != nil {
		body = c.Request.Body
	}

	// Create HTTP request
	req, err := http.NewRequest(c.Request.Method, fullURL, body)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to create request"})
		return
	}

	// Copy headers
	for key, values := range c.Request.Header {
		for _, value := range values {
			req.Header.Add(key, value)
		}
	}

	// Make the request
	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to reach service"})
		return
	}
	defer resp.Body.Close()

	// Read response body
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to read response"})
		return
	}

	// Set response headers
	for key, values := range resp.Header {
		for _, value := range values {
			c.Header(key, value)
		}
	}

	// Return response
	c.Data(resp.StatusCode, resp.Header.Get("Content-Type"), bodyBytes)
}

func main() {
	// Set Gin to release mode
	gin.SetMode(gin.ReleaseMode)

	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin,Content-Type,Accept,Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"service": "gin-gateway",
			"port":    "8090",
		})
	})

	// User Service Routes
	r.Any("/user/*path", func(c *gin.Context) {
		// Remove /user prefix and proxy to user service
		path := c.Param("path")
		if path == "" {
			path = "/"
		}
		c.Request.URL.Path = path
		ProxyRequest(c, UserServiceURL)
	})

	// Product Service Routes - wildcard first (more specific)
	r.Any("/products/*path", func(c *gin.Context) {
		// Get the wildcard part (e.g., "/2" from "/products/2")
		path := c.Param("path")
		if path == "" {
			path = "/"
		}
		// Reconstruct the full path for the product service
		originalPath := c.Request.URL.Path
		c.Request.URL.Path = "/products" + path
		fmt.Printf("DEBUG: Original path: %s, Wildcard path: %s, New path: %s\n", originalPath, path, c.Request.URL.Path)
		ProxyRequest(c, ProductServiceURL)
	})

	// Exact match for /products (less specific, after wildcard)
	r.Any("/products", func(c *gin.Context) {
		ProxyRequest(c, ProductServiceURL)
	})

	// Direct product routes (without /products prefix)
	r.Any("/my-products", func(c *gin.Context) {
		c.Request.URL.Path = "/my-products"
		ProxyRequest(c, ProductServiceURL)
	})

	// Upload routes
	r.Any("/uploads/*path", func(c *gin.Context) {
		ProxyRequest(c, ProductServiceURL)
	})

	// Root route
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Gin API Gateway",
			"version": "1.0.0",
			"services": gin.H{
				"user":    UserServiceURL,
				"product": ProductServiceURL,
			},
			"endpoints": gin.H{
				"health":        "GET /health",
				"user_register": "POST /user/register",
				"user_login":    "POST /user/login",
				"user_profile":  "GET /user/profile",
				"products":      "GET /products",
				"my_products":   "GET /my-products",
			},
		})
	})

	log.Println("🚀 Gin API Gateway starting on port 8090...")
	log.Printf("📡 User Service: %s", UserServiceURL)
	log.Printf("📦 Product Service: %s", ProductServiceURL)
	
	if err := r.Run(":8090"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
