# 🔧 حل مشكلة عدم ظهور الشعار

## ❌ المشكلة: الشعار لا يظهر في الوصل بعد رفعه

---

## ✅ الحلول (جرّبها بالترتيب)

### الحل 1️⃣: تحديث قاعدة البيانات (الأهم!)

المشكلة الرئيسية: جدول `settings` لا يدعم النصوص الطويلة بعد.

#### باستخدام MySQL:

1. افتح **MySQL Workbench** أو **MySQL Command Line**
2. شغّل الملف `update-logo-support.sql`:

```sql
USE gamescity;

ALTER TABLE settings MODIFY COLUMN `value` LONGTEXT;
```

3. ✅ تم! الآن قاعدة البيانات تدعم الشعارات

#### أو في PowerShell:
```bash
mysql -u root -p gamescity < update-logo-support.sql
```

---

### الحل 2️⃣: التحقق من الحفظ

بعد رفع الشعار:

1. افتح **Developer Tools** في المتصفح (`F12`)
2. اذهب إلى **Console**
3. ابحث عن:
   ```
   Saving logo, length: XXXXX
   Save response: {...}
   ```

4. إذا رأيت:
   - ✅ `length: 50000+` → الشعار موجود
   - ❌ `error` → هناك مشكلة في الحفظ

---

### الحل 3️⃣: التحقق من Prisma Studio

1. شغّل:
```bash
npm run db:studio
```

2. افتح `http://localhost:5555`
3. اذهب إلى جدول **settings**
4. ابحث عن سطر بـ `key = 'logoUrl'`
5. تحقق من محتوى `value`:
   - ✅ يبدأ بـ `data:image/png;base64,` → الشعار محفوظ
   - ❌ فارغ → الشعار لم يُحفظ

---

### الحل 4️⃣: إعادة جلب الإعدادات

في **Dashboard**:

1. افتح Developer Tools (`F12`)
2. Console
3. ابحث عن:
   ```
   Settings loaded: {...}
   Logo URL loaded, length: XXXXX
   ```

4. إذا لم يظهر:
   - أعد تحميل الصفحة (`Ctrl+R`)
   - أو سجل خروج ودخول

---

### الحل 5️⃣: حفظ الشعار يدوياً في قاعدة البيانات

إذا لم تعمل الطرق السابقة:

```sql
USE gamescity;

-- إضافة أو تحديث الشعار
INSERT INTO settings (`key`, `value`, `updatedAt`, `updatedBy`)
VALUES ('logoUrl', 'https://via.placeholder.com/300x150', NOW(), 'admin')
ON DUPLICATE KEY UPDATE 
  `value` = 'https://via.placeholder.com/300x150',
  `updatedAt` = NOW();
```

هذا سيضيف شعار تجريبي. جرّب إذا يظهر.

---

## 🧪 اختبار شامل

### الخطوة 1: رفع صورة صغيرة أولاً

استخدم صورة **صغيرة** (أقل من 100KB) للاختبار:

1. اذهب إلى **الإعدادات**
2. ارفع صورة صغيرة جداً
3. شاهد المعاينة
4. اضغط **حفظ**
5. انتظر رسالة "تم حفظ التغييرات بنجاح"

### الخطوة 2: التحقق في Prisma Studio

```bash
npm run db:studio
```

- افتح `settings`
- ابحث عن `logoUrl`
- هل `value` يحتوي على بيانات؟

### الخطوة 3: اختبار في Dashboard

1. اذهب إلى Dashboard
2. **أعد تحميل الصفحة** (`Ctrl+R`)
3. افتح Developer Tools → Console
4. ابحث عن:
   ```
   Logo URL loaded, length: XXXXX
   ```

### الخطوة 4: إضافة عملية

1. أضف عملية جديدة
2. في **معاينة الوصل**:
   - هل الشعار يظهر؟
3. اضغط **طباعة**:
   - هل الشعار يطبع؟

---

## 🔍 نقاط التحقق

### ✅ تحقق من:
- [ ] تم تحديث قاعدة البيانات (`ALTER TABLE`)
- [ ] الصورة أقل من 2MB
- [ ] الصورة بصيغة مدعومة (PNG, JPG)
- [ ] ظهرت المعاينة في الإعدادات
- [ ] ظهرت رسالة "تم حفظ التغييرات"
- [ ] تم إعادة تحميل Dashboard بعد الحفظ
- [ ] Console لا يعرض أخطاء

---

## 💡 نصيحة سريعة

### جرّب رابط شعار أولاً:

بدلاً من رفع ملف، استخدم رابط:

```
https://via.placeholder.com/300x150.png?text=LOGO
```

1. الصق في حقل "رابط الشعار"
2. اضغط حفظ
3. إذا ظهر → المشكلة في رفع الملف
4. إذا لم يظهر → المشكلة في قاعدة البيانات

---

## 🆘 إذا استمرت المشكلة

شغّل هذا الأمر في MySQL:

```sql
USE gamescity;

-- التحقق من نوع العمود
SHOW CREATE TABLE settings;

-- يجب أن يحتوي على:
-- `value` longtext
```

إذا كان لا يزال `varchar(191)`:
- المشكلة: لم يتم تحديث قاعدة البيانات
- الحل: شغّل `update-logo-support.sql`

---

## 📞 الدعم

افتح **Developer Console** وشارك:
1. أي أخطاء في Console
2. نتيجة `Settings loaded`
3. نتيجة `SHOW CREATE TABLE settings`

---

**🎯 هدفنا: الشعار يظهر في الوصل!**

