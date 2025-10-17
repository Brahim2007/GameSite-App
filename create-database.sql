-- قم بتشغيل هذا الملف في MySQL Command Line أو MySQL Workbench
-- للتشغيل: mysql -u root -p < create-database.sql

-- إنشاء قاعدة البيانات
CREATE DATABASE IF NOT EXISTS gamescity 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- عرض رسالة نجاح
SELECT 'قاعدة البيانات gamescity تم إنشاؤها بنجاح!' AS 'Status';

-- عرض قواعد البيانات المتاحة
SHOW DATABASES;

