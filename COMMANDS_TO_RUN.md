# الأوامر السريعة للتشغيل

## 📋 انسخ والصق هذه الأوامر بالترتيب

### 1. تثبيت التحديثات
```bash
npm install
```

### 2. رفع التغييرات على GitHub
```bash
git add .
git commit -m "Fix Vercel deployment - Add Prisma generate and ESLint"
git push origin main
```

### 3. (بعد إعداد قاعدة البيانات) اختبار الاتصال محلياً
قبل تشغيل هذا الأمر، أنشئ ملف `.env.local` وضع فيه:
```
DATABASE_URL="mysql://[connection-string-from-planetscale]"
```

ثم شغّل:
```bash
npx prisma db push
```

### 4. (اختياري) فتح Prisma Studio لإدارة البيانات
```bash
npx prisma studio
```

---

## 🔐 توليد NEXTAUTH_SECRET بسرعة

### Windows (PowerShell):
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Mac/Linux:
```bash
openssl rand -base64 32
```

### Node.js (أي نظام):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 📦 أوامر مفيدة أخرى

### إعادة توليد Prisma Client
```bash
npx prisma generate
```

### مشاهدة بنية قاعدة البيانات
```bash
npx prisma studio
```

### تشغيل المشروع محلياً
```bash
npm run dev
```

### بناء المشروع محلياً (للاختبار)
```bash
npm run build
```

### بعد البناء، تشغيل النسخة المبنية
```bash
npm start
```

---

## 🎯 الترتيب الصحيح للخطوات

1. ✅ `npm install` (على جهازك)
2. ✅ `git add . && git commit -m "..." && git push` (رفع التغييرات)
3. ✅ إنشاء قاعدة بيانات على PlanetScale (على المتصفح)
4. ✅ إضافة متغيرات البيئة في Vercel (على المتصفح)
5. ✅ Redeploy في Vercel (على المتصفح)
6. ✅ `npx prisma db push` (على جهازك مع .env.local)

---

## 📝 محتوى ملف `.env.local` (للتطوير المحلي)

أنشئ هذا الملف في جذر المشروع (لا ترفعه على GitHub):

```env
# قاعدة البيانات
DATABASE_URL="mysql://username:password@host:port/database?sslaccept=strict"

# المصادقة
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

---

## ⚠️ ملاحظات هامة

1. **لا ترفع ملف `.env.local` على GitHub** - هو مستثنى تلقائياً في .gitignore
2. **استخدم قيم مختلفة** للتطوير المحلي والإنتاج
3. **احتفظ بنسخة آمنة** من Connection String وSecret
4. **اختبر محلياً أولاً** قبل الرفع على Vercel

---

## 🚀 أمر واحد لكل شيء (All-in-One)

إذا كنت متأكداً من كل شيء:
```bash
npm install && git add . && git commit -m "Fix Vercel deployment" && git push origin main
```

---

## ✅ Checklist

قبل الرفع، تأكد من:
- [ ] قمت بـ `npm install`
- [ ] رفعت التغييرات على GitHub
- [ ] أنشأت قاعدة بيانات MySQL
- [ ] حصلت على Connection String
- [ ] ولدت NEXTAUTH_SECRET
- [ ] أضفت المتغيرات الثلاثة في Vercel
- [ ] ضغطت Redeploy في Vercel
- [ ] اختبرت الموقع بعد الرفع

---

**جاهز للانطلاق! 🎉**

