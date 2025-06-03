const Parser = require('rss-parser');
const parser = new Parser();

exports.handler = async function (event) {
  const blogId = event.queryStringParameters.blogId;
  const feedUrl = `https://blog.rss.naver.com/${blogId}.xml`;

  try {
    const feed = await parser.parseURL(feedUrl);
    const blogName = feed.title || "블로그 이름 없음";
    const postCount = feed.items.length;

    const recentPosts = feed.items.slice(0, 5).map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ blogName, postCount, recentPosts }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
