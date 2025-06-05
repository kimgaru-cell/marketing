const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { placeUrl } = JSON.parse(event.body);

  // 1. placeId 추출
  const match = placeUrl.match(/(?:place|restaurant)\/(\d{7,})/);
  if (!match) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'placeId를 추출할 수 없습니다.' }),
    };
  }

  const placeId = match[1];
  const apiUrl = `https://pcmap.place.naver.com/api/places/${placeId}/summary`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'API 요청 실패' }),
      };
    }

    const json = await response.json();

    if (!json || !json.keywordList) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'keywordList가 응답에 없습니다.' }),
      };
    }

    const keywords = json.keywordList.map(k => k.name);

    return {
      statusCode: 200,
      body: JSON.stringify({ keywords }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '오류 발생: ' + err.message }),
    };
  }
};
