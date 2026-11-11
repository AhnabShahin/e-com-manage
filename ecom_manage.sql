-- MySQL dump 10.13  Distrib 8.3.0, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ecom_manage
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Electronics','electronics','2026-11-11 10:25:56','2026-11-11 10:25:56'),(2,'Furniture','furniture','2026-11-11 10:25:56','2026-11-11 10:25:56'),(3,'Home & Living','home-living','2026-11-11 10:25:56','2026-11-11 10:25:56');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` smallint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_11_10_063206_create_personal_access_tokens_table',1),(5,'2026_11_10_070001_create_categories_table',1),(6,'2026_11_10_070002_create_shops_table',1),(7,'2026_11_10_070003_create_products_table',1),(8,'2026_11_10_070004_create_product_variations_table',1),(9,'2026_11_10_070005_create_shop_products_table',1),(10,'2026_11_10_070006_create_shop_product_variations_table',1),(11,'2026_11_10_080001_create_product_images_table',1),(12,'2026_11_10_080002_create_orders_table',1),(13,'2026_11_10_080003_create_order_items_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `shop_product_id` bigint unsigned DEFAULT NULL,
  `shop_product_variation_id` bigint unsigned DEFAULT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `variation_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `quantity` int unsigned NOT NULL,
  `line_total` decimal(12,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_order_id_foreign` (`order_id`),
  KEY `order_items_shop_product_id_foreign` (`shop_product_id`),
  KEY `order_items_shop_product_variation_id_foreign` (`shop_product_variation_id`),
  CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_shop_product_id_foreign` FOREIGN KEY (`shop_product_id`) REFERENCES `shop_products` (`id`) ON DELETE SET NULL,
  CONSTRAINT `order_items_shop_product_variation_id_foreign` FOREIGN KEY (`shop_product_variation_id`) REFERENCES `shop_product_variations` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,1,NULL,'USB-C Charging Cable',NULL,9.99,2,19.98,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(2,2,10,6,'Modular Fabric Sofa','Charcoal / 2-Seater',699.00,1,699.00,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(3,3,18,17,'Smart LED TV','55-inch',459.00,1,459.00,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(4,4,11,NULL,'Wooden Study Desk',NULL,179.00,1,179.00,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(5,5,2,NULL,'Wireless Bluetooth Headphones',NULL,49.99,2,99.98,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(6,6,14,14,'Ergonomic Office Chair','Black',149.00,1,149.00,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(7,7,7,NULL,'LED Desk Lamp',NULL,24.99,3,74.97,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(8,8,16,NULL,'USB-C Charging Cable',NULL,7.99,1,7.99,'2026-11-11 10:25:57','2026-11-11 10:25:57');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `reference` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_id` bigint unsigned NOT NULL,
  `shop_id` bigint unsigned NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `total` decimal(12,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_reference_unique` (`reference`),
  KEY `orders_customer_id_foreign` (`customer_id`),
  KEY `orders_shop_id_foreign` (`shop_id`),
  CONSTRAINT `orders_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `orders_shop_id_foreign` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'ORD-SZIVJKOS',6,1,'completed',19.98,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(2,'ORD-GIRE5BN4',6,2,'pending',699.00,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(3,'ORD-W9H0NDAE',7,4,'completed',459.00,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(4,'ORD-0XBND3VU',7,3,'pending',179.00,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(5,'ORD-UKIRWSS0',8,1,'cancelled',99.98,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(6,'ORD-NTPZOWB3',8,3,'completed',149.00,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(7,'ORD-AOLKZ16C',9,2,'pending',74.97,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(8,'ORD-TIXXUNYN',9,4,'completed',7.99,'2026-11-11 10:25:57','2026-11-11 10:25:57');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\User',6,'auth','d8bc9f4f7de08506b2b10d2e61a97f7e85258678d6dcbe722dc5ccb03f9b3773','[\"*\"]','2026-11-11 10:33:52',NULL,'2026-11-11 10:33:51','2026-11-11 10:33:52'),(2,'App\\Models\\User',6,'auth','100adb02c62708b4f7ceb12b54a6fa44e7257dce2c4cb54e0614c718c8806bb5','[\"*\"]','2026-11-11 10:34:31',NULL,'2026-11-11 10:34:30','2026-11-11 10:34:31'),(3,'App\\Models\\User',2,'auth','d676059f4276315b97a243ac83fc0e5b09664320df1105ed8529cc84834aa3dd','[\"*\"]','2026-11-11 10:34:31',NULL,'2026-11-11 10:34:30','2026-11-11 10:34:31'),(5,'App\\Models\\User',2,'auth','66ea42ea674d7a6169381502db7b66de2ef941677c780baaf0661430f19484aa','[\"*\"]','2026-11-11 10:35:10',NULL,'2026-11-11 10:35:08','2026-11-11 10:35:10'),(6,'App\\Models\\User',2,'auth','e08cbfed4755afbaf1b54c8e02f9ce717d9cdc07dfe4a43f76848ca5495416b8','[\"*\"]','2026-11-11 10:36:27',NULL,'2026-11-11 10:35:20','2026-11-11 10:36:27');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_images_product_id_foreign` (`product_id`),
  CONSTRAINT `product_images_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variations`
--

DROP TABLE IF EXISTS `product_variations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attributes` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_variations_product_id_foreign` (`product_id`),
  CONSTRAINT `product_variations_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variations`
--

LOCK TABLES `product_variations` WRITE;
/*!40000 ALTER TABLE `product_variations` DISABLE KEYS */;
INSERT INTO `product_variations` VALUES (1,3,'43-inch','TV-43','{\"Size\": \"43-inch\"}','2026-11-11 10:25:56','2026-11-11 10:25:56'),(2,3,'55-inch','TV-55','{\"Size\": \"55-inch\"}','2026-11-11 10:25:56','2026-11-11 10:25:56'),(3,3,'65-inch','TV-65','{\"Size\": \"65-inch\"}','2026-11-11 10:25:56','2026-11-11 10:25:56'),(4,7,'Black','OC-BLA','{\"Color\": \"Black\"}','2026-11-11 10:25:56','2026-11-11 10:25:56'),(5,7,'Grey','OC-GRE','{\"Color\": \"Grey\"}','2026-11-11 10:25:56','2026-11-11 10:25:56'),(6,9,'Charcoal / 2-Seater','SF-CHA-2-seater','{\"Size\": \"2-Seater\", \"Color\": \"Charcoal\"}','2026-11-11 10:25:56','2026-11-11 10:25:56'),(7,9,'Charcoal / 3-Seater','SF-CHA-3-seater','{\"Size\": \"3-Seater\", \"Color\": \"Charcoal\"}','2026-11-11 10:25:56','2026-11-11 10:25:56'),(8,9,'Sand / 2-Seater','SF-SAN-2-seater','{\"Size\": \"2-Seater\", \"Color\": \"Sand\"}','2026-11-11 10:25:56','2026-11-11 10:25:56'),(9,9,'Sand / 3-Seater','SF-SAN-3-seater','{\"Size\": \"3-Seater\", \"Color\": \"Sand\"}','2026-11-11 10:25:56','2026-11-11 10:25:56');
/*!40000 ALTER TABLE `product_variations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_by` bigint unsigned DEFAULT NULL,
  `category_id` bigint unsigned DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'simple',
  `thumbnail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_slug_unique` (`slug`),
  KEY `products_created_by_foreign` (`created_by`),
  KEY `products_category_id_foreign` (`category_id`),
  CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `products_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,1,'USB-C Charging Cable','usb-c-charging-cable','Durable 1m braided USB-C cable, 60W fast charging.','simple','products/usb-c-charging-cable.svg','2026-11-11 10:25:56','2026-11-11 10:25:56'),(2,1,1,'Wireless Bluetooth Headphones','wireless-bluetooth-headphones','Over-ear Bluetooth 5.3 headphones with 30h battery life.','simple','products/wireless-bluetooth-headphones.svg','2026-11-11 10:25:56','2026-11-11 10:25:56'),(3,1,1,'Smart LED TV','smart-led-tv','4K HDR smart TV with built-in streaming apps.','variable','products/smart-led-tv.svg','2026-11-11 10:25:56','2026-11-11 10:25:56'),(4,1,2,'Five-Tier Bookshelf','five-tier-bookshelf','Solid-frame open bookshelf with five storage tiers.','simple','products/five-tier-bookshelf.svg','2026-11-11 10:25:56','2026-11-11 10:25:56'),(5,2,3,'Ceramic Coffee Mug','ceramic-coffee-mug','350ml matte ceramic mug.','simple','products/ceramic-coffee-mug.svg','2026-11-11 10:25:56','2026-11-11 10:25:56'),(6,2,1,'LED Desk Lamp','led-desk-lamp','Dimmable LED desk lamp with adjustable arm.','simple','products/led-desk-lamp.svg','2026-11-11 10:25:56','2026-11-11 10:25:56'),(7,2,2,'Ergonomic Office Chair','ergonomic-office-chair','Mesh-back office chair with lumbar support and armrests.','variable','products/ergonomic-office-chair.svg','2026-11-11 10:25:56','2026-11-11 10:25:56'),(8,3,2,'Wooden Study Desk','wooden-study-desk','Compact study desk with a single storage drawer.','simple','products/wooden-study-desk.svg','2026-11-11 10:25:56','2026-11-11 10:25:56'),(9,3,2,'Modular Fabric Sofa','modular-fabric-sofa','Modular fabric sofa, available in two colors and sizes.','variable','products/modular-fabric-sofa.svg','2026-11-11 10:25:56','2026-11-11 10:25:56');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_product_variations`
--

DROP TABLE IF EXISTS `shop_product_variations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_product_variations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `shop_product_id` bigint unsigned NOT NULL,
  `product_variation_id` bigint unsigned NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `stock` int unsigned NOT NULL DEFAULT '0',
  `thumbnail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `shop_variation_unique` (`shop_product_id`,`product_variation_id`),
  KEY `shop_product_variations_product_variation_id_foreign` (`product_variation_id`),
  CONSTRAINT `shop_product_variations_product_variation_id_foreign` FOREIGN KEY (`product_variation_id`) REFERENCES `product_variations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `shop_product_variations_shop_product_id_foreign` FOREIGN KEY (`shop_product_id`) REFERENCES `shop_products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_product_variations`
--

LOCK TABLES `shop_product_variations` WRITE;
/*!40000 ALTER TABLE `shop_product_variations` DISABLE KEYS */;
INSERT INTO `shop_product_variations` VALUES (1,4,1,320.00,10,NULL,1,'2026-11-11 10:25:56','2026-11-11 10:25:56'),(2,4,2,480.00,10,NULL,1,'2026-11-11 10:25:56','2026-11-11 10:25:56'),(3,4,3,650.00,10,NULL,1,'2026-11-11 10:25:56','2026-11-11 10:25:56'),(4,5,4,139.00,20,NULL,1,'2026-11-11 10:25:56','2026-11-11 10:25:56'),(5,5,5,139.00,20,NULL,1,'2026-11-11 10:25:56','2026-11-11 10:25:56'),(6,10,6,699.00,7,NULL,1,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(7,10,7,899.00,8,NULL,1,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(8,10,8,699.00,8,NULL,1,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(9,10,9,899.00,8,NULL,1,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(10,12,6,749.00,6,NULL,1,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(11,12,7,949.00,6,NULL,1,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(12,12,8,749.00,6,NULL,1,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(13,12,9,949.00,6,NULL,1,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(14,14,4,149.00,14,NULL,1,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(15,14,5,149.00,15,NULL,1,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(16,18,1,299.00,7,NULL,1,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(17,18,2,459.00,6,NULL,1,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(18,18,3,599.00,7,NULL,1,'2026-11-11 10:25:57','2026-11-11 10:25:57');
/*!40000 ALTER TABLE `shop_product_variations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_products`
--

DROP TABLE IF EXISTS `shop_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `price` decimal(12,2) DEFAULT NULL,
  `thumbnail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `details` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `shop_products_shop_id_product_id_unique` (`shop_id`,`product_id`),
  KEY `shop_products_product_id_foreign` (`product_id`),
  CONSTRAINT `shop_products_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `shop_products_shop_id_foreign` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_products`
--

LOCK TABLES `shop_products` WRITE;
/*!40000 ALTER TABLE `shop_products` DISABLE KEYS */;
INSERT INTO `shop_products` VALUES (1,1,1,9.99,NULL,NULL,1,'2026-11-11 10:25:56','2026-11-11 10:25:56'),(2,1,2,49.99,NULL,NULL,1,'2026-11-11 10:25:56','2026-11-11 10:25:56'),(3,1,5,12.50,NULL,NULL,1,'2026-11-11 10:25:56','2026-11-11 10:25:56'),(4,1,3,NULL,NULL,NULL,1,'2026-11-11 10:25:56','2026-11-11 10:25:56'),(5,1,7,NULL,NULL,NULL,1,'2026-11-11 10:25:56','2026-11-11 10:25:56'),(6,2,1,8.49,NULL,NULL,1,'2026-11-11 10:25:56','2026-11-11 10:25:56'),(7,2,6,24.99,NULL,NULL,1,'2026-11-11 10:25:56','2026-11-11 10:25:56'),(8,2,8,159.00,NULL,NULL,1,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(9,2,4,189.00,NULL,NULL,1,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(10,2,9,NULL,NULL,NULL,1,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(11,3,8,179.00,NULL,NULL,1,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(12,3,9,NULL,NULL,NULL,1,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(13,3,4,209.00,NULL,NULL,1,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(14,3,7,NULL,NULL,NULL,1,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(15,3,5,14.00,NULL,NULL,1,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(16,4,1,7.99,NULL,NULL,1,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(17,4,2,44.99,NULL,NULL,1,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(18,4,3,NULL,NULL,NULL,1,'2026-11-11 10:25:57','2026-11-11 10:25:57'),(19,4,6,21.99,NULL,NULL,1,'2026-11-11 10:25:57','2026-11-11 10:25:57');
/*!40000 ALTER TABLE `shop_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shops`
--

DROP TABLE IF EXISTS `shops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shops` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `owner_id` bigint unsigned DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `shops_slug_unique` (`slug`),
  KEY `shops_owner_id_foreign` (`owner_id`),
  CONSTRAINT `shops_owner_id_foreign` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shops`
--

LOCK TABLES `shops` WRITE;
/*!40000 ALTER TABLE `shops` DISABLE KEYS */;
INSERT INTO `shops` VALUES (1,2,'Alice\'s Gadgets','alices-gadgets','Everyday electronics and smart home accessories.',1,'2026-11-11 10:25:56','2026-11-11 10:25:56'),(2,3,'Bob\'s Lifestyle','bobs-lifestyle','Furniture and home essentials.',1,'2026-11-11 10:25:56','2026-11-11 10:25:56'),(3,4,'Grace\'s Home Store','graces-home-store','Furniture and home decor for every room.',1,'2026-11-11 10:25:56','2026-11-11 10:25:56'),(4,5,'Henry\'s Electronics','henrys-electronics','Budget-friendly electronics and gadgets.',1,'2026-11-11 10:25:56','2026-11-11 10:25:56'),(5,NULL,'Unassigned Shop','unassigned-shop','Newly created, no products yet.',1,'2026-11-11 10:25:56','2026-11-11 10:25:56');
/*!40000 ALTER TABLE `shops` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'shop_owner',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_role_index` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin','admin@example.com',NULL,'$2y$12$xPMo20/sO2DvxuUeobypyeEZvpavePtigRPVR3AZ87de8ScjtjmKO','admin',1,NULL,'2026-11-11 10:25:54','2026-11-11 10:25:54'),(2,'Alice (Owner)','alice@example.com',NULL,'$2y$12$YYmh2AihLF.YpljJNa6FQOVbBNcvAgK5K0f7Q6ah84eNfA7qj1Jty','shop_owner',1,NULL,'2026-11-11 10:25:55','2026-11-11 10:25:55'),(3,'Bob (Owner)','bob@example.com',NULL,'$2y$12$5Grq1dqgzuC4ezqwvve6ceIRCwTQtlRtShe16Lw/OKYyW/2o2oDPG','shop_owner',1,NULL,'2026-11-11 10:25:55','2026-11-11 10:25:55'),(4,'Grace (Owner)','grace@example.com',NULL,'$2y$12$zP3wO.XfFPZNevCv.Agk/uhk08OtZFwi.SO6GQVpUqrJQo9XGmMTm','shop_owner',1,NULL,'2026-11-11 10:25:55','2026-11-11 10:25:55'),(5,'Henry (Owner)','henry@example.com',NULL,'$2y$12$qKf7q2TAY.s3/98o3TbQK.bIKjkx/v80RONgqn.N91V1.e/CaO1.y','shop_owner',1,NULL,'2026-11-11 10:25:55','2026-11-11 10:25:55'),(6,'Carol (Customer)','carol@example.com',NULL,'$2y$12$AzTHLIGXyeWxUjFtLOrQV.8hpEF9ERmgJ0BmbL93MLUKL.npIGL9G','customer',1,NULL,'2026-11-11 10:25:55','2026-11-11 10:25:55'),(7,'Dave (Customer)','dave@example.com',NULL,'$2y$12$bhAR37mZgCgP5h5VgILKfej.fBprUyNe5YRDW398xr9NXRwwOZB/G','customer',1,NULL,'2026-11-11 10:25:55','2026-11-11 10:25:55'),(8,'Emma (Customer)','emma@example.com',NULL,'$2y$12$GetMBJsswuoQOC2hdTygLuOYMQAHhEE9wgVOtVRzD6YW.gQaQI802','customer',1,NULL,'2026-11-11 10:25:56','2026-11-11 10:25:56'),(9,'Farhan (Customer)','farhan@example.com',NULL,'$2y$12$u1n5Behiy6OtYO7g07eOW.dqr2WSXGbftrR0Cg9Ij30B0yRykyPpK','customer',1,NULL,'2026-11-11 10:25:56','2026-11-11 10:25:56');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-11 22:56:57
