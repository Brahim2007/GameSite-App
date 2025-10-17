# ⚡ إصلاح فوري لمشكلة الشعار

## 🎯 الحل السريع (3 خطوات)

### الخطوة 1️⃣: تحديث قاعدة البيانات

افتح **MySQL Command Line** أو **MySQL Workbench** وشغّل:

```sql
USE gamescity;

ALTER TABLE settings MODIFY COLUMN `value` LONGTEXT;

SELECT '✅ تم التحديث!' AS 'Status';
```

**أو** شغّل هذا في PowerShell:
```bash
mysql -u root -p gamescity < update-logo-support.sql
```

---

### الخطوة 2️⃣: جرّب برابط أولاً

لاختبار سريع، استخدم رابط جاهز:

1. اذهب إلى **الإعدادات**
2. قسم **"شعار المنشأة"**
3. في حقل **"أو استخدم رابط الشعار"** الصق:
   ```
   https://via.placeholder.com/300x150/0ea5e9/ffffff?text=مدينة+الألعاب
   ```
4. اضغط **"حفظ الشعار"**
5. انتظر رسالة النجاح

---

### الخطوة 3️⃣: اختبر في Dashboard

1. اذهب إلى **Dashboard**
2. **أعد تحميل الصفحة** (`Ctrl+R` أو `F5`)
3. أضف عملية جديدة
4. في **معاينة الوصل** → ✅ الشعار يجب أن يظهر!

---

## 🔍 إذا لم يظهر بعد:

### افتح Developer Console (`F12`):

#### في صفحة Dashboard، ابحث عن:
```javascript
Settings loaded: {...}
Logo URL loaded, length: XXXXX
```

#### إذا رأيت:
✅ `Logo URL loaded, length: 74` → الشعار موجود!
   → المشكلة في العرض → أكمل للحل

❌ `No logo URL found` → الشعار لم يُحفظ
   → ارجع للخطوة 2

---

## 🛠️ حل مشاكل العرض

### المشكلة: الشعار محفوظ لكن لا يظهر

#### في `Receipt.tsx`:

تأكد من الكود التالي:
```typescript
{logoUrl && (
  <div className="flex justify-center mb-3">
    <img 
      src={logoUrl} 
      alt={businessName}
      className="max-h-16 object-contain"
    />
  </div>
)}
```

### افتح Console وشغّل:
```javascript
// في Developer Console
console.log('Logo URL:', document.querySelector('.thermal-receipt img')?.src);
```

---

## 🧪 اختبار مباشر في Prisma Studio

1. افتح `http://localhost:5555`
2. جدول **settings**
3. أضف سطر يدوياً:
   ```
   key: logoUrl
   value: https://via.placeholder.com/300x150
   updatedBy: admin
   ```
4. احفظ
5. أعد تحميل Dashboard
6. اختبر مرة أخرى

---

## 📋 قائمة تحقق كاملة

- [ ] قاعدة البيانات محدّثة (`ALTER TABLE`)
- [ ] الشعار محفوظ في `settings` (تحقق من Prisma Studio)
- [ ] Dashboard أعيد تحميله بعد حفظ الشعار
- [ ] Console يعرض `Logo URL loaded`
- [ ] Component Receipt يستقبل `logoUrl` prop
- [ ] الصورة بصيغة صحيحة (PNG, JPG)
- [ ] الصورة أقل من 2MB

---

## 🆘 حل سريع ومباشر

شغّل هذا في MySQL:

```sql
USE gamescity;

-- تحديث الجدول
ALTER TABLE settings MODIFY COLUMN `value` LONGTEXT;

-- إضافة شعار تجريبي
INSERT INTO settings (`key`, `value`, `updatedAt`, `updatedBy`)
VALUES ('logoUrl', 'https://via.placeholder.com/300x150.png?text=شعار', NOW(), 'admin')
ON DUPLICATE KEY UPDATE 
  `value` = 'https://via.placeholder.com/300x150.png?text=شعار',
  `updatedAt` = NOW();

SELECT 'تم!' AS 'Status';
```

ثم:
1. أعد تحميل Dashboard (`Ctrl+R`)
2. أضف عملية
3. ✅ الشعار يجب أن يظهر الآن!

---

## 📞 إذا استمرت المشكلة

**شارك معي:**
1. لقطة شاشة من Developer Console (رسائل الـ console.log)
2. لقطة شاشة من Prisma Studio (جدول settings)
3. نتيجة:
   ```sql
   SHOW CREATE TABLE settings;
   ```

---

**🎯 الهدف: رؤية الشعار في الوصل!**

