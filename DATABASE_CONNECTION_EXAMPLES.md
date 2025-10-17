# أمثلة على Connection Strings لقواعد البيانات

## 📊 قواعد بيانات MySQL مجانية للاستخدام مع Vercel

### 1. PlanetScale (موصى به بشدة) ⭐
**المميزات:**
- ✅ مجاني تماماً
- ✅ سهل الإعداد
- ✅ سريع جداً
- ✅ نسخ احتياطية تلقائية

**خطوات الإعداد:**
1. اذهب إلى: https://planetscale.com
2. أنشئ حساباً مجانياً
3. Create new database
4. اضغط على "Connect" → اختر "Prisma"
5. انسخ الـ Connection String

**مثال على Connection String:**
```
mysql://username:pscale_pw_XXXXX@aws.connect.psdb.cloud/database-name?sslaccept=strict
```

---

### 2. Railway ⭐
**المميزات:**
- ✅ مجاني (5$ كرصيد شهري)
- ✅ إعداد سريع
- ✅ يدعم MySQL و PostgreSQL

**خطوات الإعداد:**
1. اذهب إلى: https://railway.app
2. أنشئ حساباً
3. New Project → Add MySQL
4. انقر على MySQL → Connect
5. انسخ الـ MySQL Connection URL

**مثال على Connection String:**
```
mysql://root:XXXXX@containers-us-west-XX.railway.app:1234/railway
```

---

### 3. Aiven
**المميزات:**
- ✅ مجاني (نسخة تجريبية)
- ✅ موثوق

**خطوات الإعداد:**
1. اذهب إلى: https://aiven.io
2. أنشئ حساباً
3. Create service → MySQL
4. انسخ Connection String

**مثال على Connection String:**
```
mysql://username:password@mysql-project.aivencloud.com:12345/defaultdb?ssl-mode=REQUIRED
```

---

### 4. Clever Cloud
**المميزات:**
- ✅ لديه طبقة مجانية
- ✅ موثوق

**خطوات الإعداد:**
1. اذهب إلى: https://www.clever-cloud.com
2. Create → Add-on → MySQL
3. احصل على Connection details

**مثال على Connection String:**
```
mysql://username:password@mysql-XX.services.clever-cloud.com:3306/database
```

---

## 🔧 تنسيق Connection String

### MySQL (الصيغة العامة)
```
mysql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME?sslaccept=strict
```

**مكونات الـ URL:**
- `USERNAME`: اسم المستخدم
- `PASSWORD`: كلمة المرور
- `HOST`: عنوان السيرفر
- `PORT`: عادة 3306 (قد يختلف)
- `DATABASE_NAME`: اسم قاعدة البيانات

### PostgreSQL (إذا أردت التحويل)
```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME?sslmode=require
```

---

## ⚙️ إعداد Vercel Environment Variables

بعد الحصول على Connection String:

1. اذهب إلى مشروعك في Vercel
2. Settings → Environment Variables
3. أضف:
   ```
   Name: DATABASE_URL
   Value: [الصق Connection String كاملاً]
   Environments: ✓ Production ✓ Preview ✓ Development
   ```

---

## 🧪 اختبار Connection String

قبل رفع المشروع، اختبر Connection String محلياً:

1. أنشئ ملف `.env.local` في جذر المشروع:
```env
DATABASE_URL="mysql://user:pass@host:port/db?sslaccept=strict"
```

2. جرب الاتصال:
```bash
npx prisma db push
```

3. إذا نجح، فالـ Connection String صحيح! ✅

---

## ❓ أيهما أختار؟

### للمشاريع الصغيرة والمتوسطة:
**🏆 PlanetScale** - الأفضل والأسهل

### للمشاريع التجريبية:
**🏆 Railway** - سريع وسهل

### للمشاريع الكبيرة:
**🏆 AWS RDS** أو **Google Cloud SQL** (مدفوع)

---

## 🔒 نصائح الأمان

1. ❌ **لا ترفع** Connection String إلى GitHub
2. ✅ استخدم `.env.local` محلياً (مستثنى من Git)
3. ✅ ضع Connection String فقط في Vercel Environment Variables
4. ✅ استخدم Passwords قوية

---

## 📝 ملاحظات مهمة

### إذا كنت تستخدم PlanetScale:
- أضف `?sslaccept=strict` في نهاية URL
- لا تنسَ تفعيل "Safe migrations" إذا كنت في الإنتاج

### إذا كنت تستخدم Railway:
- قد يتغير Port عند إعادة التشغيل (استخدم الـ URL الكامل من Dashboard)

### إذا كنت تستخدم Aiven:
- يجب استخدام SSL mode

---

## ✅ Checklist نهائي

قبل الرفع على Vercel، تأكد من:

- [ ] حصلت على Connection String صحيح
- [ ] اختبرت Connection String محلياً بـ `npx prisma db push`
- [ ] أضفت DATABASE_URL في Vercel Environment Variables
- [ ] أضفت NEXTAUTH_SECRET في Vercel Environment Variables
- [ ] أضفت NEXTAUTH_URL في Vercel Environment Variables
- [ ] دفعت التعديلات الجديدة على GitHub
- [ ] جاهز للرفع! 🚀

---

**نصيحة أخيرة:** ابدأ بـ PlanetScale، إنه الأسهل والأفضل للبداية! 🎯

