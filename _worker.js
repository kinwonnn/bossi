// 找到这部分代码进行修改
if (pathname.startsWith("/file/")) {
  const fileName = pathname.split("/")[2];
  
  // 直接去 telegra.ph 取图，这才是这些 ID 真正的家
  const targetUrl = `https://telegra.ph/file/${fileName}`;
  
  // 使用 fetch 中转，这样你的同学不需要 VPN 也能看图
  const response = await fetch(targetUrl);
  return new Response(response.body, {
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
      "Cache-Control": "public, max-age=31536000"
    }
  });
}
