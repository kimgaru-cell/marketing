const fetch = require('node-fetch');

exports.handler = async function (event) {
  const blogId = event.queryStringParameters.blogId;
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  const query = `blog.naver.com/${blogId}`; // ID 기반 검색
  const apiUrl = `https://openapi.naver.com/v1/search/blog?query=${encodeURIComponent(query)}&display=5`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret,
      },
    });

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    const items = data.items;

    if (!items || items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: '검색 결과 없음' }),
      };
    }

    const blogName = items[0].bloggername;
    const postCount = items.length;
    const recentPostTitle = items[0].title.replace(/<[^>]+>/g, '');

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
