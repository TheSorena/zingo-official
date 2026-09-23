# Zingo Official — صفحه دانلود | zingo-official

صفحه رسمی دانلود برنامه **زینگو (Zingo)** — برنامه فیلم و سریال اندروید.

- 🌐 دیپلوی: Vercel (استاتیک، بدون بیلد)
- 📦 فایل: `/downloads/Zingo-v1.0.7.apk` نسخه 1.0.7
- 🔍 سئو: تک‌صفحه فارسی RTL + بخش انگلیسی، JSON-LD (SoftwareApplication + FAQ)، sitemap، robots، OG

## دیپلوی در ورسل

1. در Vercel گزینه **Add New → Project → Import** از `TheSorena/zingo-official`
2. Framework: **Other** — بدون Build Command، خروجی همین روت
3. بعد از دیپلوی، دامنه رندوم (مثل `xxx.vercel.app`) را کپی کن و این ۴ جا را جایگزین `https://zingo-official.vercel.app` کن:
   - `index.html` (canonical, og:url, og:image, JSON-LD)
   - `robots.txt` و `sitemap.xml`
4. در Google Search Console دامنه را ثبت و `sitemap.xml` را معرفی کن.

## آپدیت نسخه جدید

1. APK جدید را در `/downloads` بگذار
2. `downloads/version.json` و دکمه دانلود در `index.html` را آپدیت کن
3. کامیت + پوش → ورسل خودکار ریدیپلوی می‌کند.
