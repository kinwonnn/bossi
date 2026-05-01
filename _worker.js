export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // --- 1. 处理图片显示 (免 VPN 中转逻辑) ---
    if (pathname.startsWith("/file/")) {
      const fileName = pathname.split("/")[2];
      const targetUrl = `https://telegra.ph/file/${fileName}`;
      
      try {
        const response = await fetch(targetUrl);
        return new Response(response.body, {
          headers: {
            "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
            "Cache-Control": "public, max-age=31536000",
            "Access-Control-Allow-Origin": "*" // 允许跨域
          }
        });
      } catch (e) {
        return new Response("图片加载失败", { status: 500 });
      }
    }

    // --- 2. 处理图片列表接口 ---
    if (pathname === "/api/manage/list") {
      try {
        const list = await env.img_kv.list();
        return new Response(JSON.stringify(list), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (e) {
        return new Response("读取数据库失败", { status: 500 });
      }
    }

    // --- 3. 如果以上都不是，默认返回静态页面 (index.html) ---
    return env.ASSETS.fetch(request);
  }
};
