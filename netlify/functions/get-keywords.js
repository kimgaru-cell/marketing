const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { placeUrl } = JSON.parse(event.body);

  try {
    const response = await fetch(placeUrl);
    const html = await response.text();

    const keywordMatch = html.match(/keywordlist\s*:\s*\[([^\]]+)\]/i);

    if (keywordMatch) {
      const keywords = keywordMatch[1].split(',').map(k => k.trim().replace(/['"]/g, ''));
      return {
        statusCode: 200,
        body: JSON.stringify({ keywords }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: '키워드 정보를 찾을 수 없습니다.' }),
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '오류 발생: ' + err.message }),
    };
  }
};
