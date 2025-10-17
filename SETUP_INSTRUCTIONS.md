# 📋 تعليمات إعداد قاعدة البيانات

## الطريقة الأولى: استخدام Prisma (الموصى بها) ✅

### الخطوة 1: تعديل ملف `.env`

افتح ملف `.env` وعدّل كلمة مرور MySQL:

```env
DATABASE_URL="mysql://root:YOUR_MYSQL_PASSWORD@localhost:3306/gamescity"
```

استبدل `YOUR_MYSQL_PASSWORD` بكلمة مرور MySQL الخاصة بك.

### الخطوة 2: تثبيت المكتبات

```bash
npm install
```

### الخطوة 3: توليد Prisma Client

```bash
npm run db:generate
```

### الخطوة 4: إنشاء الجداول

```bash
npm run db:push
```

### الخطوة 5: ملء البيانات الوهمية

```bash
npm run db:seed
```

هذا سيُنشئ:
- ✅ 3 مستخدمين (admin, reception1, reception2)
- ✅ 15 عملية تجريبية لليوم الحالي
- ✅ إعدادات افتراضية (السعر = 50 ريال)
- ✅ سجل تصفير يومي

---

## الطريقة الثانية: استخدام MySQL مباشرة 🔧

إذا واجهت مشاكل مع Prisma، يمكنك استخدام ملف SQL:

### الخطوة 1: افتح MySQL Command Line

```bash
mysql -u root -p
```

أدخل كلمة المرور عندما يُطلب منك.

### الخطوة 2: نفّذ ملف SQL

```sql
source C:/projects/GamesCity/database_setup.sql
```

أو انسخ محتويات الملف والصقها مباشرة في MySQL.

### الخطوة 3: تحديث كلمات المرور

**مهم جداً:** الملف SQL يحتوي على كلمات مرور placeholder. يجب تحديثها:

```bash
npm run db:seed
```

هذا سيقوم بتحديث كلمات المرور المشفرة بشكل صحيح.

---

## التحقق من النجاح ✓

### 1. باستخدام Prisma Studio:

```bash
npm run db:studio
```

سيفتح على `http://localhost:5555` - تحقق من:
- ✅ وجود 3 مستخدمين
- ✅ وجود 15 عملية
- ✅ وجود إعدادين

### 2. باستخدام MySQL:

```sql
USE gamescity;

-- عرض المستخدمين
SELECT id, username, name, role FROM users;

-- عرض عدد العمليات
SELECT COUNT(*) as total_entries FROM entries;

-- عرض الإعدادات
SELECT * FROM settings;
```

---

## حل المشاكل ❗

### مشكلة: خطأ في المصادقة

**السبب:** كلمة مرور MySQL غير صحيحة في ملف `.env`

**الحل:**
1. افتح MySQL Workbench أو Command Line
2. قم بإنشاء مستخدم جديد بدون كلمة مرور:

```sql
CREATE USER 'gamescity'@'localhost';
GRANT ALL PRIVILEGES ON gamescity.* TO 'gamescity'@'localhost';
FLUSH PRIVILEGES;
```

3. عدّل `.env`:
```env
DATABASE_URL="mysql://gamescity:@localhost:3306/gamescity"
```

### مشكلة: قاعدة البيانات موجودة مسبقاً

**الحل:**
```sql
DROP DATABASE IF EXISTS gamescity;
CREATE DATABASE gamescity CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### مشكلة: Prisma generate فشل

**الحل:**
```bash
rm -rf node_modules
rm package-lock.json
npm install
npm run db:generate
```

---

## البيانات التجريبية 📊

### المستخدمون:

| اسم المستخدم | كلمة المرور | الاسم | الدور |
|--------------|-------------|-------|-------|
| admin | admin | أحمد محمد | ADMIN |
| reception1 | reception1 | فاطمة علي | RECEPTION |
| reception2 | reception2 | محمود حسن | RECEPTION |

### الإعدادات:

- **السعر الافتراضي:** 50 ريال
- **اسم المنشأة:** مدينة الألعاب الترفيهية

### العمليات:

- **15 عملية** موزعة على اليوم الحالي (9 صباحاً - 4 مساءً)
- **إجمالي الزبائن:** ~45 زبون
- **إجمالي المبلغ:** ~2,250 ريال

---

## الخطوة التالية 🚀

بعد إعداد قاعدة البيانات:

```bash
npm run dev
```

افتح المتصفح على `http://localhost:3000` وسجل دخول بأحد الحسابات!

---

## ملاحظات مهمة 📌

1. **البيانات للتطوير فقط** - في الإنتاج استخدم كلمات مرور قوية
2. **النسخ الاحتياطي** - احفظ نسخة احتياطية قبل أي تعديلات
3. **الأمان** - لا تشارك ملف `.env` أبداً
4. **التصفير اليومي** - يتم تلقائياً حسب التاريخ

---

**هل واجهت مشكلة؟** راجع [DATABASE_SETUP.md](./DATABASE_SETUP.md) للمزيد من التفاصيل.

