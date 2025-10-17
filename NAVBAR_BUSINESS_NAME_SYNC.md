# ✅ ربط اسم المنشأة مع الـ Navbar (البنر العلوي)

## 🎯 الهدف:
جعل اسم المنشأة في الـ Navbar ديناميكياً يتحدث تلقائياً عند تغييره من صفحة الإعدادات.

---

## 📝 التغييرات المطبقة:

### **components/Navbar.tsx**

#### 1️⃣ إضافة Imports:
```typescript
import React, { useState, useEffect } from 'react';
```

#### 2️⃣ إضافة State:
```typescript
const [businessName, setBusinessName] = useState('مدينة الألعاب الترفيهية');
```
- القيمة الافتراضية: "مدينة الألعاب الترفيهية"
- تتحدث عند جلب البيانات من API

#### 3️⃣ إضافة useEffect لجلب البيانات:
```typescript
useEffect(() => {
  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        if (data.settings.businessName) {
          setBusinessName(data.settings.businessName.value);
        }
      }
    } catch (error) {
      console.error('Error fetching business name:', error);
    }
  };

  fetchSettings();
  
  // Re-fetch when navigating (to update after settings change)
  const handleFocus = () => fetchSettings();
  window.addEventListener('focus', handleFocus);
  
  return () => window.removeEventListener('focus', handleFocus);
}, [pathname]);
```

**شرح:**
- يجلب البيانات عند تحميل الصفحة
- **يعيد جلب البيانات عند التنقل بين الصفحات** (`pathname` dependency)
- **يعيد جلب البيانات عند focus على النافذة** (window focus event)
- ينظف event listener عند unmount

#### 4️⃣ استخدام المتغير الديناميكي:
```typescript
// ❌ من:
<h1 className="text-xl font-bold text-primary-600">
  مدينة الألعاب الترفيهية
</h1>

// ✅ إلى:
<h1 className="text-xl font-bold text-primary-600">
  {businessName}
</h1>
```

---

## 🔄 كيف يعمل التحديث التلقائي:

### السيناريو 1: عند تحميل الصفحة
1. المستخدم يفتح التطبيق
2. الـ Navbar يُحمّل
3. `useEffect` ينفذ تلقائياً
4. يجلب اسم المنشأة من `/api/settings`
5. يحدث `businessName` state
6. الـ Navbar يعرض الاسم الجديد

### السيناريو 2: عند تغيير الإعدادات
1. المدير يفتح صفحة الإعدادات
2. يغير اسم المنشأة
3. يضغط "حفظ"
4. البيانات تُحفظ في قاعدة البيانات
5. المدير ينتقل لصفحة أخرى (Dashboard، التقارير، إلخ)
6. **`pathname` يتغير**
7. `useEffect` ينفذ مرة أخرى
8. يجلب الاسم الجديد
9. الـ Navbar يتحدث تلقائياً ✅

### السيناريو 3: عند العودة للتطبيق
1. المستخدم يفتح تبويب آخر
2. يعود للتطبيق
3. **`window focus` event يُطلق**
4. `useEffect` يجلب البيانات مرة أخرى
5. الـ Navbar يتحدث إذا كان هناك تغيير ✅

---

## ✅ النتيجة:

الآن:
- ✅ **اسم المنشأة في الـ Navbar ديناميكي**
- ✅ **يتحدث تلقائياً عند التنقل بين الصفحات**
- ✅ **يتحدث عند تغيير الإعدادات**
- ✅ **يتحدث عند focus على النافذة**
- ✅ **لا حاجة لتحديث الصفحة يدوياً**

---

## 📋 اختبار الميزة:

### 1️⃣ تسجيل الدخول كمدير:
```
اسم المستخدم: admin
كلمة المرور: admin
```

### 2️⃣ انتقل إلى الإعدادات:
- انقر على "الإعدادات" في الـ Navbar

### 3️⃣ غيّر اسم المنشأة:
- اكتب اسم جديد في حقل "اسم المنشأة"
- مثال: "صالة الترفيه الرياضية"
- اضغط "حفظ الإعدادات"

### 4️⃣ انتقل لصفحة أخرى:
- انقر على "الرئيسية" أو "التقرير اليومي"
- **لاحظ أن اسم المنشأة في الـ Navbar تحدّث تلقائياً!** ✅

### 5️⃣ افتح صفحة الإعدادات مرة أخرى:
- **الاسم الجديد موجود في جميع الصفحات** ✅

---

## 🔍 الأماكن التي يظهر فيها اسم المنشأة الآن:

1. ✅ **Navbar (البنر العلوي)** - ديناميكي
2. ✅ **Dashboard** - ديناميكي
3. ✅ **الوصل المطبوع** - ديناميكي
4. ✅ **التقرير اليومي (PDF)** - ديناميكي
5. ✅ **التقرير الشهري (PDF)** - ديناميكي
6. ✅ **صفحة الإعدادات** - ديناميكي

---

## 💡 ملاحظات تقنية:

### لماذا `pathname` في dependencies؟
```typescript
}, [pathname]);
```
- يضمن إعادة جلب البيانات عند التنقل
- بدونه، الاسم لن يتحدث إلا عند تحديث الصفحة

### لماذا `window focus` event؟
```typescript
window.addEventListener('focus', handleFocus);
```
- مفيد عند العمل في بيئة multi-tab
- أو عند العودة من تطبيق آخر
- يضمن أن البيانات دائماً محدثة

### لماذا cleanup function؟
```typescript
return () => window.removeEventListener('focus', handleFocus);
```
- لمنع memory leaks
- يزيل event listener عند unmount الـ component

---

## 🎉 تم بنجاح!

اسم المنشأة الآن:
- 📱 **متزامن في جميع الصفحات**
- 🔄 **يتحدث تلقائياً**
- ⚡ **بدون تحديث يدوي**
- 💯 **تجربة مستخدم سلسة**

---

## 🚀 المزيد من التحسينات المستقبلية (اختياري):

### 1. استخدام Context API:
```typescript
// BusinessNameContext.tsx
const BusinessNameContext = createContext();

// يُستخدم في جميع الصفحات
const { businessName, updateBusinessName } = useBusinessName();
```

### 2. استخدام Custom Event:
```typescript
// عند الحفظ في صفحة Settings
window.dispatchEvent(new CustomEvent('businessNameChanged', { 
  detail: { businessName: newName } 
}));

// في Navbar
window.addEventListener('businessNameChanged', handleBusinessNameChange);
```

### 3. استخدام State Management (Zustand/Redux):
```typescript
// store.ts
const useStore = create((set) => ({
  businessName: '',
  setBusinessName: (name) => set({ businessName: name }),
}));
```

**لكن الحل الحالي بسيط وفعال ويعمل بشكل ممتاز!** ✅

