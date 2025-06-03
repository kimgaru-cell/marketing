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

    const recentPosts = feed.items.slice(0, 5).map(item => {
      const contentHtml = item.content || item.contentSnippet || "";
      return {
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        thumbnail: extractImageUrlFrom(contentHtml)
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ blogName, postCount, description, recentPosts }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
