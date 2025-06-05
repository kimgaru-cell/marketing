const fetch = require('node-fetch');

export default async function handler(req, res) {
  // 모든 도메인에서 요청 허용 (배포 후 필요하면 도메인 제한 가능)
  res.setHeader('Access-Control-Allow-Origin', '*');
  // 허용할 HTTP 메서드 설정
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  // 허용할 요청 헤더 설정
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 메서드에 대해 미리 응답 (CORS preflight 대응)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 요청만 허용됩니다.' });
  }

  const { placeUrl } = req.body;

  const match = placeUrl.match(/(?:place|restaurant)\/(\d+)/);
  if (!match) {
    return res.status(400).json({ error: 'placeId를 추출할 수 없습니다.' });
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

    if (!response.ok) {
      return res.status(response.status).json({ error: 'API 요청 실패' });
    }

    const json = await response.json();

    if (!json || !json.keywordList) {
      return res.status(404).json({ error: 'keywordList가 응답에 없습니다.' });
    }

    const keywords = json.keywordList.map(k => k.name);
    return res.status(200).json({ keywords });

  } catch (err) {
    return res.status(500).json({ error: '오류 발생: ' + err.message });
  }
}
