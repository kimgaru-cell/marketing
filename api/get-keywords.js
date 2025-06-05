const fetch = require('node-fetch');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST 요청만 허용됩니다.' });

  let { placeUrl } = req.body;

  // 단축 URL 처리
  if (placeUrl.includes('naver.me')) {
    try {
      const headRes = await fetch(placeUrl, { method: 'HEAD', redirect: 'follow' });
      placeUrl = headRes.url; // 리디렉션된 최종 URL
    } catch (err) {
      return res.status(500).json({ error: '단축 URL 처리 실패: ' + err.message });
    }
  }

  // placeId 추출
  const match = placeUrl.match(/(?:place|restaurant)\/(\d+)/);
  if (!match) {
    return res.status(400).json({ error: '유효한 장소 URL이 아닙니다. 장소 상세페이지에서 "공유 → URL 복사"를 이용해주세요.' });
  }

  const placeId = match[1];
  const apiUrl = `https://pcmap.place.naver.com/api/places/${placeId}/summary`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) return res.status(response.status).json({ error: '네이버 API 요청 실패' });

    const data = await response.json();

    if (!data || !data.keywordList) {
      return res.status(404).json({ error: '해당 장소에 키워드 정보가 없습니다.' });
    }

    const keywords = data.keywordList.map(k => k.name);
    return res.status(200).json({ keywords });

  } catch (err) {
    return res.status(500).json({ error: '내부 오류 발생: ' + err.message });
  }
}

