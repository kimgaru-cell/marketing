const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const username = event.queryStringParameters.username;
  if (!username) {
    return { statusCode: 400, body: JSON.stringify({ error: 'username required' }) };
  }

  try {
    const response = await fetch(`https://instagram-public-data-api-url/user/${username}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '45b31f709dmshb13fc5dd2b49e08p1a16dcjsne8c1be7b6770',
        'X-RapidAPI-Host': 'instagram-public-bulk-scraper.p.rapidapi.com'
      }
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        followers: data.followers,
        posts: data.posts,
        avgLikes: data.avgLikes,
        // 필요 데이터만 골라서
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API 호출 실패', details: err.message }),
    };
  }
};
