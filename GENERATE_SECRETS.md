# توليد المفاتيح السرية لـ Vercel

## NEXTAUTH_SECRET

هذا المفتاح ضروري لتشفير الجلسات والتوكنات في NextAuth.

### الطريقة 1: استخدام الموقع (الأسهل)
1. اذهب إلى: https://generate-secret.vercel.app/32
2. انسخ المفتاح المولد
3. استخدمه كقيمة لـ `NEXTAUTH_SECRET` في Vercel

### الطريقة 2: استخدام JavaScript
افتح Console المتصفح (F12) والصق هذا الكود:
```javascript
console.log(btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))));
```

### الطريقة 3: استخدام Node.js
إذا كان لديك Node.js على جهازك:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### الطريقة 4: استخدام موقع آخر
1. اذهب إلى: https://www.random.org/strings/
2. اختر طول 32 حرف
3. اختر Alphanumeric
4. انسخ النتيجة

---

## مثال على القيم النهائية

```
DATABASE_URL=mysql://user:pass@aws.connect.psdb.cloud/dbname?sslaccept=strict
NEXTAUTH_SECRET=Xy9k2m4nP8qR5sT7vW9xZ1aC3eF5gH7j
NEXTAUTH_URL=https://your-project.vercel.app
```

---

## ⚠️ تحذيرات مهمة

1. ❌ **لا تشارك** NEXTAUTH_SECRET مع أي شخص
2. ❌ **لا ترفعه** إلى GitHub في ملف .env
3. ✅ **ضعه فقط** في Vercel Environment Variables
4. ✅ **استخدم مفتاح مختلف** للتطوير المحلي والإنتاج

---

## التحقق من المفتاح

المفتاح الصحيح يجب أن:
- ✅ يكون على الأقل 32 حرفاً
- ✅ يحتوي على أحرف وأرقام
- ✅ يكون عشوائياً تماماً
- ❌ لا يحتوي على مسافات

---

## مثال كامل لإضافة المتغيرات في Vercel

1. اذهب إلى مشروعك على Vercel
2. Settings → Environment Variables
3. أضف كل متغير على حدة:

**المتغير 1:**
```
Name: DATABASE_URL
Value: mysql://user:pass@host/db
Environment: Production, Preview, Development
```

**المتغير 2:**
```
Name: NEXTAUTH_SECRET
Value: [المفتاح المولد من أعلاه]
Environment: Production, Preview, Development
```

**المتغير 3:**
```
Name: NEXTAUTH_URL
Value: https://your-project.vercel.app
Environment: Production
```

4. احفظ واضغط "Redeploy"

✅ **انتهى!**

