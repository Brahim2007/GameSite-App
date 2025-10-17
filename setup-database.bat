@echo off
chcp 65001 >nul
echo ========================================
echo     إعداد قاعدة بيانات مدينة الألعاب
echo ========================================
echo.

echo [1/4] توليد Prisma Client...
call npm run db:generate
if errorlevel 1 (
    echo ❌ فشل توليد Prisma Client
    echo الحل: أغلق أي برنامج قد يستخدم المشروع
    echo أو شغل كـ Administrator
    pause
    exit /b 1
)
echo ✅ تم توليد Prisma Client
echo.

echo [2/4] إنشاء الجداول في قاعدة البيانات...
call npm run db:push
if errorlevel 1 (
    echo ❌ فشل إنشاء الجداول
    echo تأكد من:
    echo - MySQL يعمل
    echo - كلمة المرور صحيحة في .env
    echo - قاعدة البيانات gamescity موجودة
    pause
    exit /b 1
)
echo ✅ تم إنشاء الجداول
echo.

echo [3/4] ملء البيانات التجريبية...
call npm run db:seed
if errorlevel 1 (
    echo ❌ فشل ملء البيانات
    pause
    exit /b 1
)
echo ✅ تم ملء البيانات
echo.

echo [4/4] التحقق من البيانات...
echo.
echo ========================================
echo     ✅ تم إعداد قاعدة البيانات بنجاح!
echo ========================================
echo.
echo البيانات التجريبية:
echo - 3 مستخدمين
echo - 15 عملية لليوم
echo - إعدادات افتراضية
echo.
echo الحسابات:
echo - admin / admin (مدير)
echo - reception1 / reception1 (استقبال)
echo - reception2 / reception2 (استقبال)
echo.
echo لتشغيل التطبيق: npm run dev
echo لعرض قاعدة البيانات: npm run db:studio
echo.
pause

