const Parser = require('rss-parser');
const parser = new Parser();

function extractImageUrlFrom(html) {
  const match = html.match(/<img[^>]+src=["']?([^>"']+)["']?/i);
  return match ? match[1] : null;
}

exports.handler = async function (event) {
  const blogId = event.queryStringParameters.blogId;
  const feedUrl = `https://blog.rss.naver.com/${blogId}.xml`;
  
  try {
    const feed = await parser.parseURL(feedUrl);
    const blogName = feed.title || "블로그 이름 없음";
    const postCount = feed.items.length;
    const description = feed.description || "";

    // 썸네일 추출 (본문 content가 없을 경우도 고려)
    const contentHtml = feed.items[0]?.content || feed.items[0]?.contentSnippet || "";
    const thumbnail = extractImageUrlFrom(contentHtml);

    const recentPosts = feed.items.slice(0, 5).map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ blogName, postCount, description, recentPosts, thumbnail, }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
