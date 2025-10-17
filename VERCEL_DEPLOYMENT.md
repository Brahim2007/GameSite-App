# دليل رفع المشروع على Vercel

## التعديلات المطبقة

تم إصلاح المشاكل التالية للرفع على Vercel:

### 1. إصلاح مشكلة Prisma Client
- تم تعديل سكريبت `build` في `package.json` ليشمل `prisma generate`
- تم إضافة سكريبت `postinstall` لتوليد Prisma Client تلقائياً بعد التثبيت

### 2. إضافة ESLint
- تم إضافة `eslint` و `eslint-config-next` إلى devDependencies

### 3. إنشاء ملف تكوين Vercel
- تم إنشاء `vercel.json` لضمان تشغيل الأوامر الصحيحة أثناء البناء

## خطوات الرفع على Vercel

### 1. إعداد قاعدة البيانات

**مهم جداً**: لا يمكن استخدام SQLite على Vercel. يجب استخدام قاعدة بيانات سحابية.

#### الخيار الأول: Vercel Postgres (موصى به)
1. اذهب إلى مشروعك في Vercel Dashboard
2. اضغط على تبويب "Storage"
3. اختر "Create Database" → "Postgres"
4. انتظر حتى يتم إنشاء قاعدة البيانات
5. سيتم إضافة `DATABASE_URL` تلقائياً إلى متغيرات البيئة

#### الخيار الثاني: Supabase
1. أنشئ حساباً على [Supabase](https://supabase.com)
2. أنشئ مشروعاً جديداً
3. احصل على Connection String من Settings → Database
4. أضفها كمتغير بيئة `DATABASE_URL` في Vercel

#### الخيار الثالث: PlanetScale
1. أنشئ حساباً على [PlanetScale](https://planetscale.com)
2. أنشئ قاعدة بيانات جديدة
3. احصل على Connection String
4. أضفها كمتغير بيئة `DATABASE_URL` في Vercel

### 2. تحديث ملف Prisma Schema

إذا كنت تستخدم قاعدة بيانات غير SQLite، قد تحتاج لتحديث `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // بدلاً من sqlite
  url      = env("DATABASE_URL")
}
```

### 3. إعداد متغيرات البيئة في Vercel

في لوحة تحكم Vercel:
1. اذهب إلى Settings → Environment Variables
2. أضف المتغيرات التالية:

```
DATABASE_URL=postgresql://...  (من قاعدة البيانات السحابية)
NEXTAUTH_SECRET=your-random-secret-key  (استخدم: openssl rand -base64 32)
NEXTAUTH_URL=https://your-domain.vercel.app
```

### 4. دفع التعديلات إلى GitHub

```bash
git add .
git commit -m "Fix Vercel deployment issues"
git push origin main
```

### 5. الرفع على Vercel

#### إذا كان المشروع غير متصل بـ Vercel بعد:
1. اذهب إلى [Vercel Dashboard](https://vercel.com)
2. اضغط "Import Project"
3. اختر مستودع GitHub الخاص بك
4. أضف متغيرات البيئة
5. اضغط "Deploy"

#### إذا كان المشروع متصلاً بالفعل:
- سيتم رفع المشروع تلقائياً عند دفع التغييرات إلى GitHub

### 6. تهيئة قاعدة البيانات

بعد نجاح الرفع، قم بتهيئة قاعدة البيانات:

```bash
# من جهازك المحلي مع DATABASE_URL من Vercel
npx prisma db push
npx prisma db seed  # إذا كان لديك بيانات أولية
```

أو استخدم Prisma Studio:
```bash
npx prisma studio
```

## ملاحظات مهمة

1. **قاعدة البيانات**: تأكد من استخدام PostgreSQL أو MySQL، ليس SQLite
2. **NEXTAUTH_SECRET**: استخدم مفتاح عشوائي قوي
3. **NEXTAUTH_URL**: يجب أن يكون نطاقك الفعلي في الإنتاج
4. **Prisma Migrations**: قد تحتاج لتشغيل `prisma db push` أو `prisma migrate deploy` بعد الرفع

## استكشاف الأخطاء

### خطأ: "Prisma Client is not generated"
- تأكد من أن سكريبت `build` يحتوي على `prisma generate`
- تحقق من أن سكريبت `postinstall` موجود في `package.json`

### خطأ: "ESLint must be installed"
- تأكد من أن `eslint` و `eslint-config-next` موجودان في devDependencies

### خطأ في الاتصال بقاعدة البيانات
- تحقق من صحة `DATABASE_URL` في متغيرات البيئة
- تأكد من أن قاعدة البيانات السحابية تعمل
- تحقق من أن provider في schema.prisma يطابق نوع قاعدة البيانات

## الخطوات التالية

بعد نجاح الرفع:
1. اختبر جميع وظائف التطبيق
2. أنشئ حساب مسؤول أولي
3. تأكد من عمل المصادقة بشكل صحيح
4. اختبر جميع التقارير والإحصائيات

## موارد مفيدة

- [Vercel Deployment Documentation](https://vercel.com/docs)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

