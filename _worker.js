export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    // 1. 如果访问的是图片路径 /file/xxx
    if (pathname.startsWith("/file/")) {
      const fileId = pathname.split("/")[2];
      // 这里的逻辑是：由 CF 去请求 Telegram，同学不需要直连 TG
      const tgUrl = `https://api.telegram.org/file/bot${env.TG_Bot_Token}/${fileId}`;
      
      const response = await fetch(tgUrl);
      // 将 TG 的图片流原封不动传给同学的浏览器
      return new Response(response.body, {
        headers: {
          "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
          "Cache-Control": "public, max-age=31536000" // 增加缓存，加载更快
        }
      });
    }

    // 2. 如果访问的是管理后台接口 (API)
    if (pathname === "/api/manage/list") {
      const list = await env.img_kv.list();
      return new Response(JSON.stringify(list), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // 其他请求交给 Pages 的静态 HTML 处理
    return env.ASSETS.fetch(request);
  }
};
