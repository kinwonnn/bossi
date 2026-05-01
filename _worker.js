export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 1. 图片中转逻辑 (针对 Telegra.ph 优化)
    if (pathname.startsWith("/file/")) {
      const fileName = pathname.split("/")[2];
      const targetUrl = `https://telegra.ph/file/${fileName}`;
      
      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
          "Referer": "https://telegra.ph/"
        }
      });

      // 如果 telegra.ph 返回正常，才输出图片
      if (response.ok) {
        return new Response(response.body, {
          headers: {
            "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
            "Cache-Control": "public, max-age=31536000",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
      return new Response("图片源丢失", { status: 404 });
    }

    // 2. 获取列表接口
    if (pathname === "/api/manage/list") {
      const list = await env.img_kv.list();
      return new Response(JSON.stringify(list), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // 3. 其他静态资源
    return env.ASSETS.fetch(request);
  }
};
