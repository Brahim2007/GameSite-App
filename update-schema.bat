@echo off
chcp 65001 >nul
echo ========================================
echo   تحديث قاعدة البيانات لدعم الشعار
echo ========================================
echo.

echo هذا سيحدث schema قاعدة البيانات لدعم حفظ الشعار
echo.

echo [1/2] توليد Prisma Client الجديد...
call npm run db:generate
if errorlevel 1 (
    echo ❌ فشل توليد Prisma Client
    pause
    exit /b 1
)
echo ✅ تم توليد Prisma Client
echo.

echo [2/2] تحديث الجداول في قاعدة البيانات...
call npm run db:push
if errorlevel 1 (
    echo ❌ فشل تحديث الجداول
    pause
    exit /b 1
)
echo ✅ تم تحديث الجداول
echo.

echo ========================================
echo     ✅ التحديث اكتمل بنجاح!
echo ========================================
echo.
echo الآن يمكنك رفع الشعار من صفحة الإعدادات
echo.
pause

