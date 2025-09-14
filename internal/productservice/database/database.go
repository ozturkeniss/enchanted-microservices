package database

import (
	"fmt"
	"log"

	"enchanted-micro/internal/productservice/config"
	"enchanted-micro/internal/productservice/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB(cfg *config.Config) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Europe/Istanbul",
		cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Veritabanına bağlanılamadı:", err)
	}

	log.Println("PostgreSQL veritabanına başarıyla bağlanıldı!")

	// Auto migrate
	err = DB.AutoMigrate(&models.Product{})
	if err != nil {
		log.Fatal("Migration hatası:", err)
	}

	log.Println("Veritabanı tabloları oluşturuldu!")
}

func GetDB() *gorm.DB {
	return DB
}
