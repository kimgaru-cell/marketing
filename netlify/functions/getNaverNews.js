const fetch = require('node-fetch');

exports.handler = async function(event) {
  const query = event.queryStringParameters.query || '파스토';
  const url = `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(query)}&display=5&sort=date`;

  try {
    const res = await fetch(url, {
      headers: {
        'X-Naver-Client-Id': 'v_qk9AMOLoRyxy6VP6_9',
        'X-Naver-Client-Secret': '9LUBV1ooso'
      }
    });

    const data = await res.json();
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
