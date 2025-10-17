# 🗄️ دليل إعداد قاعدة البيانات

دليل شامل لإعداد قاعدة بيانات MySQL مع Prisma لنظام إدارة مدينة الألعاب.

## 📋 المتطلبات

قبل البدء، تأكد من تثبيت:

1. **Node.js** 18 أو أحدث
2. **MySQL Server** 8.0 أو أحدث
3. **npm** أو **yarn**

---

## 🚀 خطوات الإعداد

### 1️⃣ تثبيت MySQL

#### على Windows:
1. قم بتحميل MySQL من [الموقع الرسمي](https://dev.mysql.com/downloads/installer/)
2. اتبع معالج التثبيت
3. احفظ كلمة مرور المستخدم `root`

#### على Mac:
```bash
brew install mysql
brew services start mysql
```

#### على Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

### 2️⃣ إنشاء قاعدة البيانات

افتح MySQL CLI أو MySQL Workbench:

```sql
-- إنشاء قاعدة البيانات
CREATE DATABASE gamescity CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- (اختياري) إنشاء مستخدم خاص بالتطبيق
CREATE USER 'gamescity_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON gamescity.* TO 'gamescity_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3️⃣ تكوين ملف البيئة

أنشئ ملف `.env` في جذر المشروع:

```env
# قاعدة البيانات
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/gamescity"

# إذا أنشأت مستخدم خاص
# DATABASE_URL="mysql://gamescity_user:your_password@localhost:3306/gamescity"

# NextAuth (مطلوب للمصادقة)
NEXTAUTH_SECRET="your-random-secret-key-change-this"
NEXTAUTH_URL="http://localhost:3000"
```

**⚠️ مهم:**
- استبدل `YOUR_PASSWORD` بكلمة مرور MySQL الخاصة بك
- غيّر `NEXTAUTH_SECRET` إلى قيمة عشوائية قوية
- **لا تشارك ملف `.env`** - هو في `.gitignore`

### 4️⃣ تثبيت المكتبات

```bash
npm install
```

### 5️⃣ إعداد Prisma

```bash
# توليد Prisma Client
npm run db:generate

# إنشاء الجداول في قاعدة البيانات
npm run db:push
```

### 6️⃣ ملء البيانات الأولية (Seeding)

```bash
npm run db:seed
```

هذا الأمر سينشئ:
- ✅ 3 مستخدمين تجريبيين (admin, reception1, reception2)
- ✅ الإعدادات الافتراضية (السعر = 50 ريال)
- ✅ 15 عملية تجريبية لليوم الحالي

---

## 🎯 التحقق من نجاح الإعداد

### افتح Prisma Studio:
```bash
npm run db:studio
```

سيفتح متصفح على `http://localhost:5555` حيث يمكنك:
- عرض جميع الجداول
- التحقق من البيانات
- تعديل البيانات يدوياً

---

## 🔧 أوامر مفيدة

```bash
# توليد Prisma Client
npm run db:generate

# إنشاء/تحديث الجداول
npm run db:push

# ملء البيانات الأولية
npm run db:seed

# فتح Prisma Studio
npm run db:studio

# تشغيل المشروع
npm run dev
```

---

## 📊 هيكل قاعدة البيانات

### الجداول:

#### 1. **users** (المستخدمون)
- `id`: معرف فريد
- `username`: اسم المستخدم (فريد)
- `password`: كلمة المرور (مشفرة)
- `name`: الاسم الكامل
- `role`: الدور (ADMIN أو RECEPTION)

#### 2. **entries** (العمليات)
- `id`: معرف فريد
- `serialNumber`: رقم تسلسلي (يتصفر يومياً)
- `numberOfCustomers`: عدد الزبائن
- `pricePerPerson`: السعر للفرد
- `totalAmount`: المبلغ الإجمالي
- `date`: تاريخ ووقت العملية
- `userId`: معرف المستخدم

#### 3. **settings** (الإعدادات)
- `id`: معرف فريد
- `key`: مفتاح الإعداد (فريد)
- `value`: القيمة
- `updatedBy`: من قام بالتحديث

#### 4. **daily_resets** (تصفير يومي)
- `id`: معرف فريد
- `resetDate`: تاريخ التصفير
- `lastSerialNumber`: آخر رقم تسلسلي

---

## ❓ حل المشاكل الشائعة

### مشكلة: `Client does not support authentication protocol`

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
```

### مشكلة: `Access denied for user`

تأكد من:
- كلمة المرور صحيحة في ملف `.env`
- MySQL قيد التشغيل
- اسم قاعدة البيانات صحيح

### مشكلة: `Can't connect to MySQL server`

```bash
# Windows
net start MySQL80

# Mac
brew services start mysql

# Linux
sudo systemctl start mysql
```

### مشكلة: Prisma generate فشل

```bash
# احذف node_modules وأعد التثبيت
rm -rf node_modules
npm install
npm run db:generate
```

---

## 🔐 الأمان

### في الإنتاج:

1. **غيّر كلمات المرور الافتراضية:**
```bash
# ستحتاج لإنشاء كلمات مرور جديدة مشفرة
```

2. **استخدم متغيرات بيئة آمنة:**
- لا تضع معلومات حساسة في الكود
- استخدم خدمات إدارة الأسرار

3. **قيّد الصلاحيات:**
- لا تستخدم `root` في الإنتاج
- أنشئ مستخدم بصلاحيات محدودة

4. **فعّل SSL:**
```env
DATABASE_URL="mysql://user:pass@host:3306/db?sslmode=require"
```

---

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من سجلات الأخطاء
2. راجع [وثائق Prisma](https://www.prisma.io/docs)
3. راجع [وثائق MySQL](https://dev.mysql.com/doc/)

---

## ✅ قائمة التحقق

- [ ] MySQL مثبت ويعمل
- [ ] قاعدة البيانات `gamescity` منشأة
- [ ] ملف `.env` تم إنشاؤه وتكوينه
- [ ] تم تشغيل `npm install`
- [ ] تم تشغيل `npm run db:generate`
- [ ] تم تشغيل `npm run db:push`
- [ ] تم تشغيل `npm run db:seed`
- [ ] Prisma Studio يعمل (`npm run db:studio`)
- [ ] التطبيق يعمل (`npm run dev`)

---

**🎉 إذا أكملت جميع الخطوات، قاعدة بياناتك جاهزة للاستخدام!**

