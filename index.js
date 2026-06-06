// آدرس اسکریپت مقصد را اینجا قرار دهید
const TARGET_URL = 'https://www.firstcctv.ir/webhook-logger.php';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // فقط مسیر /webhook را با متد POST قبول می‌کنیم
    if (url.pathname === '/webhook' && request.method === 'POST') {
      try {
        // دریافت بدنه درخواست تلگرام (JSON) به صورت رشته
        const bodyText = await request.text();

        // فوروارد کردن دقیقاً همان بدنه به مقصد، بدون تغییر
        const response = await fetch(TARGET_URL, {
          method: 'POST',
          headers: {
            // ارسال Content-Type مشابه درخواست اصلی، در غیر این صورت JSON
            'Content-Type': request.headers.get('Content-Type') || 'application/json',
          },
          body: bodyText,
        });

        // لاگ گرفتن از وضعیت فوروارد (اختیاری)
        console.log(`فوروارد انجام شد - وضعیت مقصد: ${response.status}`);
      } catch (error) {
        console.error('خطا در فوروارد کردن:', error);
      }

      // بدون توجه به نتیجه، به تلگرام پاسخ 200 برگردانید
      // تا از تلاش‌های مجدد جلوگیری شود
      return new Response(null, { status: 200 });
    }

    // مسیرهای دیگر یا متدهای دیگر
    return new Response('Not Found', { status: 404 });
  },
};