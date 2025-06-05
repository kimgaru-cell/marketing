const fetch = require('node-fetch');

export default async function handler(req, res) {
  // CORS 처리
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 요청만 허용됩니다.' });
  }

  let { placeUrl } = req.body;

  // 1. 단축 URL(naver.me)이라면 실제 URL로 변환
  if (placeUrl.includes('naver.me')) {
    try {
      const headResponse = await fetch(placeUrl, {
        method: 'HEAD',
        redirect: 'follow',  // 자동 리다이렉트 허용
      });
      placeUrl = headResponse.url; // 최종 리다이렉트 URL 얻기
    } catch (err) {
      return res.status(500).json({ error: '단축 URL 변환 실패: ' + err.message });
    }
  }

  // 2. placeId 추출 (숫자 부분)
  const match = placeUrl.match(/(?:place|restaurant)\/(\d+)/);
  if (!match) {
    return res.status(400).json({ error: 'placeId를 추출할 수 없습니다. 올바른 장소 URL을 입력해주세요.' });
  }

  const placeId = match[1];

  // 3. 네이버 장소 summary API 호출
  const apiUrl = `https://pcmap.place.naver.com/api/places/${placeId}/summary`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'API 요청 실패' });
    }

    const json = await response.json();

    if (!json || !json.keywordList) {
      return res.status(404).json({ error: '키워드 정보가 응답에 없습니다.' });
    }

    const keywords = json.keywordList.map(k => k.name);

    return res.status(200).json({ keywords });

  } catch (err) {
    return res.status(500).json({ error: '오류 발생: ' + err.message });
  }
}
