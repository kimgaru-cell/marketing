const fetch = require('node-fetch');

export default async function handler(req, res) {
  const { placeUrl } = req.body;

  const match = placeUrl.match(/(?:place|restaurant)\/(\d{7,})/);
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
