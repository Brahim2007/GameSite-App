-- إنشاء قاعدة البيانات
CREATE DATABASE IF NOT EXISTS gamescity CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gamescity;

-- حذف الجداول القديمة إن وُجدت
DROP TABLE IF EXISTS `entries`;
DROP TABLE IF EXISTS `settings`;
DROP TABLE IF EXISTS `daily_resets`;
DROP TABLE IF EXISTS `users`;

-- جدول المستخدمين
CREATE TABLE `users` (
  `id` VARCHAR(191) NOT NULL,
  `username` VARCHAR(191) NOT NULL,
  `password` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `role` ENUM('ADMIN', 'RECEPTION') NOT NULL DEFAULT 'RECEPTION',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_key` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول العمليات
CREATE TABLE `entries` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `serialNumber` INT NOT NULL,
  `numberOfCustomers` INT NOT NULL,
  `pricePerPerson` DOUBLE NOT NULL,
  `totalAmount` DOUBLE NOT NULL,
  `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `userId` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `entries_date_idx` (`date`),
  KEY `entries_userId_idx` (`userId`),
  CONSTRAINT `entries_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول الإعدادات
CREATE TABLE `settings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `key` VARCHAR(191) NOT NULL,
  `value` VARCHAR(191) NOT NULL,
  `updatedAt` DATETIME(3) NOT NULL,
  `updatedBy` VARCHAR(191) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `settings_key_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول التصفير اليومي
CREATE TABLE `daily_resets` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `resetDate` DATETIME(3) NOT NULL,
  `lastSerialNumber` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `daily_resets_resetDate_key` (`resetDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- إدخال المستخدمين (كلمات المرور مشفرة بـ bcrypt)
-- كلمة المرور لكل مستخدم هي نفس اسم المستخدم
INSERT INTO `users` (`id`, `username`, `password`, `name`, `role`, `createdAt`, `updatedAt`) VALUES
('cluid001', 'admin', '$2a$10$YourHashedPasswordHere1', 'أحمد محمد', 'ADMIN', NOW(), NOW()),
('cluid002', 'reception1', '$2a$10$YourHashedPasswordHere2', 'فاطمة علي', 'RECEPTION', NOW(), NOW()),
('cluid003', 'reception2', '$2a$10$YourHashedPasswordHere3', 'محمود حسن', 'RECEPTION', NOW(), NOW());

-- ملاحظة: يجب تشغيل seed script لتوليد كلمات مرور مشفرة صحيحة
-- لكن للتجربة السريعة، يمكن استخدام هذه القيم المؤقتة

-- إدخال الإعدادات
INSERT INTO `settings` (`key`, `value`, `updatedAt`, `updatedBy`) VALUES
('defaultPrice', '50', NOW(), 'أحمد محمد'),
('businessName', 'مدينة الألعاب الترفيهية', NOW(), 'أحمد محمد');

-- إدخال عمليات تجريبية لليوم الحالي
INSERT INTO `entries` (`serialNumber`, `numberOfCustomers`, `pricePerPerson`, `totalAmount`, `date`, `userId`, `createdAt`) VALUES
(1, 3, 50, 150, DATE_ADD(CURDATE(), INTERVAL 9 HOUR), 'cluid001', NOW()),
(2, 2, 50, 100, DATE_ADD(CURDATE(), INTERVAL 9 HOUR + INTERVAL 30 MINUTE), 'cluid002', NOW()),
(3, 4, 50, 200, DATE_ADD(CURDATE(), INTERVAL 10 HOUR), 'cluid001', NOW()),
(4, 1, 50, 50, DATE_ADD(CURDATE(), INTERVAL 10 HOUR + INTERVAL 30 MINUTE), 'cluid003', NOW()),
(5, 5, 50, 250, DATE_ADD(CURDATE(), INTERVAL 11 HOUR), 'cluid002', NOW()),
(6, 2, 50, 100, DATE_ADD(CURDATE(), INTERVAL 11 HOUR + INTERVAL 30 MINUTE), 'cluid001', NOW()),
(7, 3, 50, 150, DATE_ADD(CURDATE(), INTERVAL 12 HOUR), 'cluid003', NOW()),
(8, 4, 50, 200, DATE_ADD(CURDATE(), INTERVAL 12 HOUR + INTERVAL 30 MINUTE), 'cluid002', NOW()),
(9, 2, 50, 100, DATE_ADD(CURDATE(), INTERVAL 13 HOUR), 'cluid001', NOW()),
(10, 3, 50, 150, DATE_ADD(CURDATE(), INTERVAL 13 HOUR + INTERVAL 30 MINUTE), 'cluid002', NOW()),
(11, 1, 50, 50, DATE_ADD(CURDATE(), INTERVAL 14 HOUR), 'cluid003', NOW()),
(12, 4, 50, 200, DATE_ADD(CURDATE(), INTERVAL 14 HOUR + INTERVAL 30 MINUTE), 'cluid001', NOW()),
(13, 2, 50, 100, DATE_ADD(CURDATE(), INTERVAL 15 HOUR), 'cluid002', NOW()),
(14, 3, 50, 150, DATE_ADD(CURDATE(), INTERVAL 15 HOUR + INTERVAL 30 MINUTE), 'cluid003', NOW()),
(15, 5, 50, 250, DATE_ADD(CURDATE(), INTERVAL 16 HOUR), 'cluid001', NOW());

-- إدخال سجل التصفير اليومي
INSERT INTO `daily_resets` (`resetDate`, `lastSerialNumber`) VALUES
(CURDATE(), 15);

-- عرض النتائج
SELECT '✅ تم إنشاء قاعدة البيانات بنجاح!' AS 'Status';
SELECT COUNT(*) AS 'عدد المستخدمين' FROM users;
SELECT COUNT(*) AS 'عدد العمليات' FROM entries;
SELECT COUNT(*) AS 'عدد الإعدادات' FROM settings;

