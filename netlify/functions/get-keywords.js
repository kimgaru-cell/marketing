const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { placeUrl } = JSON.parse(event.body);

  // ❶ placeId 추출 (스마트플레이스 URL 또는 네이버 지도 URL 지원)
  const match = placeUrl.match(/(?:place|restaurant)\/(\d{7,})/);
  if (!match) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'placeId를 추출할 수 없습니다.' }),
    };
  }

  const placeId = match[1];

  // ❷ 내부 API 주소 구성
  const apiUrl = `https://pcmap.place.naver.com/api/places/${placeId}/summary`;

  try {
    // ❸ API 요청 (브라우저인 척 User-Agent 추가)
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
      },
    });

    const json = await response.json();

    // ❹ keywordList 파싱
    const keywords = json.keywordList?.map(k => k.name) || [];

    if (keywords.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ keywords }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: '키워드를 찾을 수 없습니다.' }),
      };
    }

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '오류 발생: ' + err.message }),
    };
  }
};
