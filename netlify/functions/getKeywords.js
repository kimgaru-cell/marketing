const fetch = require('node-fetch');

exports.handler = async function (event) {
  const { keyword } = event.queryStringParameters;

  const displayCount = 20;
  const url = `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(keyword)}&display=${displayCount}&sort=date`;
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  try {
    const res = await fetch(url, {
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret
      }
    });

    const json = await res.json();

    // 기사 제목만 추출 후 HTML 태그 제거
    const titles = json.items.map(item => item.title.replace(/<[^>]+>/g, ''));

    // 단어 분석
    const allWords = titles.join(' ')
      .replace(/[^\w가-힣\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length >= 2 && !['관련', '뉴스', '보도', '기자', '네이버', '입니다'].includes(word));

    // 빈도수 계산
    const freqMap = {};
    allWords.forEach(word => {
      freqMap[word] = (freqMap[word] || 0) + 1;
    });

    const sorted = Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10); // 상위 10개 키워드

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ keywords: sorted }),
    };
  } catch (error) {
    console.error('키워드 분석 오류:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
