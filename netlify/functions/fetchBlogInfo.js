const fetch = require("node-fetch");
const cheerio = require("cheerio");

exports.handler = async function (event, context) {
  const blogId = event.queryStringParameters.blogId;

  try {
    const res = await fetch(`https://blog.naver.com/${blogId}`);
    const html = await res.text();
    const $ = cheerio.load(html);

    const nickname = $("meta[property='og:title']").attr("content");
    const description = $("meta[property='og:description']").attr("content");

    return {
      statusCode: 200,
      body: JSON.stringify({
        blogId,
        nickname: nickname || "정보 없음",
        description: description || "설명 없음",
      }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "크롤링 실패", details: e.message }),
    };
  }
};
