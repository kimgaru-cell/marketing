const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  const { keyword } = event.queryStringParameters;

  const url = `https://api.allorigins.win/raw?url=https://news.google.com/rss/search?q=${encodeURIComponent(keyword)}`;
  const res = await fetch(url);
  const xml = await res.text();

  const titles = Array.from(xml.matchAll(/<title><!\[CDATA\[(.*?)\]\]><\/title>/g))
                      .map(match => match[1])
                      .filter(t => !t.includes('Google 뉴스'));

  const allWords = titles.join(' ')
    .replace(/[^\w가-힣\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length >= 2 && !['관련', '뉴스', '보도', '입니다', '기자'].includes(word));

  const freqMap = {};
  allWords.forEach(word => {
    freqMap[word] = (freqMap[word] || 0) + 1;
  });

  const sorted = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10); // 상위 10개만

  return {
    statusCode: 200,
    body: JSON.stringify({ keywords: sorted }),
  };
};
