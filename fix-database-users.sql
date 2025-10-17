-- ==================================================
-- إصلاح مشكلة اسم الموظف undefined في التقارير
-- ==================================================
-- هذا السكربت يصلح البيانات في قاعدة البيانات

USE gamescity;

-- ==================================================
-- 1. عرض إحصائيات البيانات الحالية
-- ==================================================
SELECT 
  COUNT(*) as 'إجمالي العمليات',
  COUNT(CASE WHEN u.id IS NOT NULL THEN 1 END) as 'عمليات مع موظفين',
  COUNT(CASE WHEN u.id IS NULL THEN 1 END) as 'عمليات بدون موظفين'
FROM entries e
LEFT JOIN users u ON e.userId = u.id;

-- ==================================================
-- 2. عرض العمليات المشكلة (بدون userId صحيح)
-- ==================================================
SELECT 
  e.id as 'رقم العملية',
  e.serialNumber as 'رقم الوصل',
  e.date as 'التاريخ',
  e.userId as 'رقم المستخدم',
  e.numberOfCustomers as 'عدد الزبائن',
  e.totalAmount as 'المبلغ'
FROM entries e
LEFT JOIN users u ON e.userId = u.id
WHERE u.id IS NULL
ORDER BY e.date DESC;

-- ==================================================
-- 3. عرض المستخدمين المتاحين
-- ==================================================
SELECT 
  id as 'رقم المستخدم',
  name as 'الاسم',
  username as 'اسم المستخدم',
  role as 'الدور',
  createdAt as 'تاريخ الإنشاء'
FROM users
ORDER BY role, createdAt;

-- ==================================================
-- 4. إصلاح العمليات بربطها بالمدير
-- ==================================================
-- ⚠️ قم بتشغيل هذا الأمر فقط إذا كانت هناك عمليات بدون userId صحيح

UPDATE entries 
SET userId = (
  SELECT id 
  FROM users 
  WHERE role = 'ADMIN' 
  ORDER BY createdAt ASC 
  LIMIT 1
)
WHERE userId IS NULL 
   OR userId = '' 
   OR userId NOT IN (SELECT id FROM users);

-- ==================================================
-- 5. التحقق من الإصلاح
-- ==================================================
SELECT 
  COUNT(*) as 'إجمالي العمليات بعد الإصلاح',
  COUNT(CASE WHEN u.id IS NOT NULL THEN 1 END) as 'عمليات مع موظفين',
  COUNT(CASE WHEN u.id IS NULL THEN 1 END) as 'عمليات بدون موظفين (يجب أن تكون 0)'
FROM entries e
LEFT JOIN users u ON e.userId = u.id;

-- ==================================================
-- 6. (اختياري) عرض آخر 20 عملية مع أسماء الموظفين
-- ==================================================
SELECT 
  e.id,
  e.serialNumber as 'رقم الوصل',
  DATE_FORMAT(e.date, '%Y-%m-%d %H:%i') as 'التاريخ والوقت',
  u.name as 'اسم الموظف',
  e.numberOfCustomers as 'عدد الزبائن',
  e.totalAmount as 'المبلغ'
FROM entries e
INNER JOIN users u ON e.userId = u.id
ORDER BY e.date DESC
LIMIT 20;

-- ==================================================
-- ✅ انتهى السكربت
-- ==================================================

