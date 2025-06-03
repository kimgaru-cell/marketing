const Parser = require('rss-parser');
const parser = new Parser();

exports.handler = async function (event) {
  const blogId = event.queryStringParameters.blogId;
  const feedUrl = `https://blog.rss.naver.com/${blogId}.xml`;

  try {
    const feed = await parser.parseURL(feedUrl);
    const blogName = feed.title || "블로그 이름 없음";
    const postCount = feed.items.length;
    const recentPostTitle = feed.items[0]?.title || "최근 글 없음";

    return {
      statusCode: 200,
      body: JSON.stringify({ blogName, postCount, recentPostTitle }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
