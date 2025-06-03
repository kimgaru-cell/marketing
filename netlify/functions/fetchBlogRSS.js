const axios = require('axios');
const xml2js = require('xml2js');

function extractImageUrlFrom(html) {
  const match = html.match(/<img[^>]+src=["']?([^>"']+)["']?/i);
  return match ? match[1] : null;
}

exports.handler = async function (event) {
  const blogId = event.queryStringParameters.blogId;
  const feedUrl = `https://blog.rss.naver.com/${blogId}.xml`;

  try {
    const response = await axios.get(feedUrl);
    const parsed = await xml2js.parseStringPromise(response.data, { explicitArray: false });

    const channel = parsed.rss.channel;
    const items = Array.isArray(channel.item) ? channel.item : [channel.item];

    const blogName = channel.title || "블로그 이름 없음";
    const description = channel.description || "";
    const postCount = items.length;

    const recentPosts = items.slice(0, 5).map(item => {
      const contentHtml = item['content:encoded'] || item.description || "";
      return {
        title: item.title,
        link: item.link,
        pubDate: item.pubDate
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
