const fetch = require('node-fetch');

// 메모리 캐시 저장소
let cache = {};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST가 아니면 거부
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 요청만 허용됩니다.' });
  }

  try {
    const { placeUrl } = req.body;

    // URL에서 placeId 추출
    const match = placeUrl.match(/(?:place|restaurant)\/(\d+)/);
    if (!match) {
      return res.status(400).json({ error: 'placeId를 추출할 수 없습니다.' });
    }

    const placeId = match[1];
    const apiUrl = `https://pcmap.place.naver.com/api/places/${placeId}/summary`;

    const now = Date.now();
    const cacheEntry = cache[placeId];

    // 10분 이내 캐시가 있다면 캐시 응답 반환
    if (cacheEntry && now - cacheEntry.timestamp < 10 * 60 * 1000) {
      return res.status(200).json({ keywords: cacheEntry.keywords, cached: true });
    }

    // 네이버 API 요청
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Referer': 'https://map.naver.com/',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `API 요청 실패 (${response.status})` });
    }

    const json = await response.json();

    if (!json || !json.keywordList) {
      return res.status(404).json({ error: 'keywordList가 응답에 없습니다.' });
    }

    const keywords = json.keywordList.map(k => k.name);

    // 캐시에 저장
    cache[placeId] = {
      keywords,
      timestamp: now,
    };

    return res.status(200).json({ keywords });

  } catch (err) {
    return res.status(500).json({ error: '오류 발생: ' + err.message });
  }
}
