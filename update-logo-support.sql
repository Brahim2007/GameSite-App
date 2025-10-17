-- تحديث جدول settings لدعم الشعارات الكبيرة (Base64)
USE gamescity;

-- تحديث نوع العمود لدعم نصوص طويلة
ALTER TABLE settings MODIFY COLUMN `value` LONGTEXT;

-- التحقق من التحديث
DESCRIBE settings;

-- رسالة نجاح
SELECT '✅ تم تحديث جدول settings بنجاح!' AS 'Status';
SELECT 'الآن يمكنك رفع الشعار من صفحة الإعدادات' AS 'Message';

