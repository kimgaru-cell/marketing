const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const username = event.queryStringParameters.username;
  const rapidApiKey = process.env.RAPIDAPI_KEY; // 환경변수에서 불러옴

  if (!username) {
    return { statusCode: 400, body: JSON.stringify({ error: 'username required' }) };
  }

  if (!rapidApiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'RAPIDAPI_KEY is missing in environment variables' }) };
  }

  try {
    const response = await fetch(`https://instagram-api-fast-reliable-data-scraper.p.rapidapi.com/ig/user_followers/?username=${username}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'instagram-api-fast-reliable-data-scraper.p.rapidapi.com'
      }
    });

    const data = await response.json();
    console.log("📦 받은 데이터:", data);

    return {
      statusCode: 200,
      body: JSON.stringify({
        followers: data.followers,
        posts: data.posts,
        avgLikes: data.avgLikes,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API 호출 실패', details: err.message }),
    };
  }
};
