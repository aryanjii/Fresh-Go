-- ==========================================================
-- Grocery Delivery Website - Database Schema
-- Database: grocery_db
-- Table: users (Strictly for User Authentication)
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `grocery_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `grocery_db`;

-- Drop table if already exists
DROP TABLE IF EXISTS `users`;

-- Create users table
CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
