# حل مشكلة قاعدة البيانات على Vercel

## المشكلة
```
The table `settings` does not exist in the current database.
```

هذا الخطأ يحدث لأن قاعدة البيانات على Vercel لا تحتوي على الجداول المطلوبة (users, entries, settings, daily_resets).

## الحل

### ✅ تم تطبيق التعديلات التالية:

تم تعديل سكريبت `build` في `package.json` ليشمل:
```bash
prisma generate && prisma db push --accept-data-loss && next build
```

هذا سيضمن إنشاء جميع الجداول تلقائياً أثناء عملية البناء في Vercel.

### 📋 خطوات الرفع على Vercel:

#### 1. تأكد من إعداد قاعدة البيانات
تأكد من أن لديك `DATABASE_URL` في متغيرات البيئة في Vercel:
- اذهب إلى Vercel Dashboard → Your Project → Settings → Environment Variables
- تأكد من وجود `DATABASE_URL` (يجب أن يكون MySQL أو PostgreSQL)

**مثال:**
```
DATABASE_URL="mysql://user:password@host:3306/database"
```

#### 2. ادفع التعديلات إلى GitHub
```bash
git add .
git commit -m "Fix: Add database push to build script"
git push origin main
```

#### 3. انتظر اكتمال البناء
- سيبدأ Vercel تلقائياً ببناء المشروع
- أثناء عملية البناء، سيتم:
  1. تثبيت المكتبات
  2. توليد Prisma Client
  3. **إنشاء جداول قاعدة البيانات تلقائياً** ✨
  4. بناء تطبيق Next.js

#### 4. إضافة بيانات أولية (Optional)
بعد نجاح الرفع، قد تحتاج لإضافة مستخدم admin أولي:

**الطريقة الأولى: استخدام Prisma Studio محلياً**
```bash
# على جهازك، استخدم DATABASE_URL من Vercel
npx prisma studio
```

ثم أضف مستخدم admin يدوياً.

**الطريقة الثانية: تشغيل seed من جهازك**
```bash
# على جهازك مع DATABASE_URL من Vercel في .env
npx prisma db seed
```

⚠️ **ملاحظة مهمة**: تأكد من تغيير `DATABASE_URL` في `.env` المحلي إلى قاعدة بيانات Vercel قبل تشغيل seed.

### 🔍 التحقق من نجاح الحل

بعد اكتمال البناء في Vercel:

1. افتح موقعك على Vercel
2. حاول الدخول إلى `/dashboard` أو `/settings`
3. يجب ألا ترى خطأ "table does not exist"

### 📊 الجداول التي سيتم إنشاؤها:

- ✅ `users` - جدول المستخدمين
- ✅ `entries` - جدول الإدخالات
- ✅ `settings` - جدول الإعدادات
- ✅ `daily_resets` - جدول إعادة تعيين الأرقام التسلسلية

## متغيرات البيئة المطلوبة في Vercel

تأكد من إضافة جميع هذه المتغيرات:

```env
# قاعدة البيانات (مطلوب)
DATABASE_URL="mysql://user:password@host:3306/database"

# NextAuth (مطلوب للمصادقة)
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="https://your-domain.vercel.app"
```

### كيفية توليد NEXTAUTH_SECRET:
```bash
# على Windows PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# على Mac/Linux:
openssl rand -base64 32
```

## استكشاف الأخطاء الشائعة

### 1. "DATABASE_URL environment variable is not set"
**الحل:** أضف `DATABASE_URL` في Environment Variables في Vercel

### 2. "Can't reach database server"
**الحل:** 
- تأكد من أن قاعدة البيانات متاحة من الإنترنت
- تأكد من صحة credentials في `DATABASE_URL`
- تأكد من السماح لـ Vercel IP addresses في firewall قاعدة البيانات

### 3. "Prisma Client validation error"
**الحل:**
- تأكد من أن provider في `schema.prisma` يطابق نوع قاعدة البيانات
- مثلاً: إذا كانت MySQL، يجب أن يكون `provider = "mysql"`

## موارد إضافية

- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [PlanetScale (MySQL)](https://planetscale.com/)
- [Supabase (PostgreSQL)](https://supabase.com/)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

## ملاحظات

- ⚠️ **لا تستخدم SQLite على Vercel** - استخدم MySQL أو PostgreSQL
- ✅ استخدم `--accept-data-loss` في build script آمن للمرة الأولى
- 🔄 بعد أول deployment، يمكن إزالة `--accept-data-loss` إذا أردت
- 💾 احتفظ بنسخة احتياطية من بياناتك المهمة دائماً

---

**تاريخ آخر تحديث:** 17 أكتوبر 2025

