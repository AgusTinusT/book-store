-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               11.7.2-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for bookstore_db
CREATE DATABASE IF NOT EXISTS `bookstore_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `bookstore_db`;

-- Dumping structure for table bookstore_db.books
CREATE TABLE IF NOT EXISTS `books` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `author` varchar(255) NOT NULL,
  `isbn` varchar(13) DEFAULT NULL,
  `price` double NOT NULL,
  `publication_year` int(11) DEFAULT NULL,
  `publisher` varchar(255) DEFAULT NULL,
  `stock` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKkibbepcitr0a3cpk3rfr7nihn` (`isbn`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table bookstore_db.books: ~0 rows (approximately)
INSERT INTO `books` (`id`, `created_at`, `updated_at`, `author`, `isbn`, `price`, `publication_year`, `publisher`, `stock`, `title`) VALUES
	(1, '2025-06-07 18:03:46.000000', '2025-06-07 18:03:46.000000', 'Robert C. Martin', '9780132350884', 350000, 2008, 'Pearson Education', 50, 'Clean Code'),
	(2, '2025-06-07 18:03:46.000000', '2025-06-07 18:05:22.113276', 'Andrew Hunt, David Thomas', '9780135957059', 400000, 1999, 'Addison-Wesley Professional', 29, 'The Pragmatic Programmer'),
	(3, '2025-06-07 18:03:46.000000', '2025-06-07 18:03:46.000000', 'Joshua Bloch', '9780134685991', 380000, 2017, 'Addison-Wesley Professional', 45, 'Effective Java'),
	(4, '2025-06-07 18:03:46.000000', '2025-06-07 18:05:54.646060', 'Martin Kleppmann', '9781449373320', 500000, 2017, 'O\'Reilly Media', 25, 'Designing Data-Intensive Applications'),
	(5, '2025-06-07 18:03:46.000000', '2025-06-07 18:03:46.000000', 'Martin Fowler', '9780134757599', 420000, 2018, 'Addison-Wesley Professional', 40, 'Refactoring: Improving the Design of Existing Code'),
	(6, '2025-06-07 18:03:46.000000', '2025-06-07 18:03:46.000000', 'Kathy Sierra, Bert Bates', '9780596009205', 280000, 2005, 'O\'Reilly Media', 60, 'Head First Java');

-- Dumping structure for table bookstore_db.members
CREATE TABLE IF NOT EXISTS `members` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `address` text DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK9d30a9u1qpg8eou0otgkwrp5d` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table bookstore_db.members: ~0 rows (approximately)
INSERT INTO `members` (`id`, `created_at`, `updated_at`, `address`, `email`, `name`, `phone_number`) VALUES
	(1, '2025-06-07 18:04:43.000000', '2025-06-07 18:04:43.000000', 'Jl. Merdeka No. 10, Jakarta', 'budi.santoso@example.com', 'Budi Santoso', '081234567890'),
	(2, '2025-06-07 18:04:43.000000', '2025-06-07 18:04:43.000000', 'Perumahan Indah Blok A No. 5, Surabaya', 'siti.aminah@example.com', 'Siti Aminah', '085678901234'),
	(3, '2025-06-07 18:04:43.000000', '2025-06-07 18:04:43.000000', 'Gg. Melati No. 15, Bandung', 'joko.susilo@example.com', 'Joko Susilo', '087812345678'),
	(4, '2025-06-07 18:04:43.000000', '2025-06-07 18:04:43.000000', 'Jl. Pahlawan No. 20, Yogyakarta', 'dewi.lestari@example.com', 'Dewi Lestari', '081198765432');

-- Dumping structure for table bookstore_db.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKofx66keruapi6vyqpv6f2or37` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table bookstore_db.roles: ~0 rows (approximately)
INSERT INTO `roles` (`id`, `name`) VALUES
	(1, 'ROLE_ADMIN');

-- Dumping structure for table bookstore_db.transactions
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `due_date` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `return_date` date DEFAULT NULL,
  `total_amount` double DEFAULT NULL,
  `transaction_date` datetime(6) NOT NULL,
  `transaction_status` enum('BATAL','SELESAI','TERLAMBAT','TERTUNDA') NOT NULL,
  `transaction_type` enum('PEMBELIAN','PEMINJAMAN','PENGEMBALIAN') NOT NULL,
  `book_id` bigint(20) NOT NULL,
  `member_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKhwis5rd79vrejvuuuc513px7a` (`book_id`),
  KEY `FKsm5fuqx3871l7xsmsytjfpj2h` (`member_id`),
  CONSTRAINT `FKhwis5rd79vrejvuuuc513px7a` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`),
  CONSTRAINT `FKsm5fuqx3871l7xsmsytjfpj2h` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table bookstore_db.transactions: ~0 rows (approximately)

-- Dumping structure for table bookstore_db.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table bookstore_db.users: ~0 rows (approximately)
INSERT INTO `users` (`id`, `created_at`, `updated_at`, `password`, `username`) VALUES
	(1, '2025-06-07 17:56:53.000000', '2025-06-07 17:57:04.000000', '$2a$10$LtorF16N3HHpri7FmoofjeSinWxtmQ.sCOsWsUaoxlqV9hzuT8h5e', 'admin');

-- Dumping structure for table bookstore_db.user_roles
CREATE TABLE IF NOT EXISTS `user_roles` (
  `user_id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `FKh8ciramu9cc9q3qcqiv4ue8a6` (`role_id`),
  CONSTRAINT `FKh8ciramu9cc9q3qcqiv4ue8a6` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `FKhfh9dx7w3ubf1co1vdev94g3f` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Dumping data for table bookstore_db.user_roles: ~0 rows (approximately)
INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
	(1, 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
