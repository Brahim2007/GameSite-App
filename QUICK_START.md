# ⚡ دليل البدء السريع

دليل مختصر لتشغيل نظام إدارة مدينة الألعاب في 5 دقائق.

## ✅ المتطلبات

تأكد من تثبيت:
- ✅ Node.js 18+
- ✅ MySQL 8.0+
- ✅ npm أو yarn

---

## 🚀 خطوات التشغيل السريع

### 1. تثبيت المكتبات
```bash
npm install
```

### 2. إعداد MySQL

افتح MySQL CLI وقم بتشغيل:
```sql
CREATE DATABASE gamescity CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. إنشاء ملف `.env`

أنشئ ملف `.env` في جذر المشروع:

```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/gamescity"
NEXTAUTH_SECRET="change-this-to-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```

⚠️ **مهم:** استبدل `YOUR_PASSWORD` بكلمة مرور MySQL الخاصة بك

### 4. إعداد قاعدة البيانات

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 5. تشغيل التطبيق

```bash
npm run dev
```

### 6. فتح التطبيق

افتح المتصفح على:
```
http://localhost:3000
```

---

## 👤 الحسابات التجريبية

| النوع | اسم المستخدم | كلمة المرور |
|------|-------------|-------------|
| 🔑 مدير | `admin` | `admin` |
| 👤 استقبال 1 | `reception1` | `reception1` |
| 👤 استقبال 2 | `reception2` | `reception2` |

---

## 🎯 الخطوات التالية

بعد تسجيل الدخول:

1. **صفحة Dashboard**: إضافة عمليات دخول جديدة
2. **الإعدادات** (للمدير فقط): تعديل السعر واسم المنشأة
3. **التقرير اليومي**: عرض ملخص اليوم
4. **التقرير الشهري**: عرض ملخص الشهر

---

## 🛠️ أدوات مفيدة

### عرض قاعدة البيانات
```bash
npm run db:studio
```
يفتح واجهة رسومية على `http://localhost:5555`

### إعادة تعبئة البيانات
```bash
npm run db:seed
```

---

## ❌ حل المشاكل

### المشكلة: لا يمكن الاتصال بـ MySQL
**الحل:**
```bash
# Windows
net start MySQL80

# Mac
brew services start mysql

# Linux
sudo systemctl start mysql
```

### المشكلة: خطأ في كلمة المرور
**الحل:**
- تأكد من كلمة المرور في ملف `.env`
- تأكد من عدم وجود مسافات إضافية

### المشكلة: `Prisma generate failed`
**الحل:**
```bash
rm -rf node_modules
npm install
npm run db:generate
```

---

## 📚 مزيد من المعلومات

- [دليل إعداد قاعدة البيانات الكامل](./DATABASE_SETUP.md)
- [README الرئيسي](./README.md)

---

## ✨ ميزات سريعة

- ✅ إضافة عمليات دخول
- ✅ طباعة الوصولات
- ✅ تقارير يومية وشهرية
- ✅ تصدير PDF و Excel
- ✅ رسوم بيانية تفاعلية
- ✅ إدارة الأسعار
- ✅ مستخدمين متعددين
- ✅ واجهة عربية كاملة

---

**🎉 استمتع باستخدام النظام!**

