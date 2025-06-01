const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const blogId = event.queryStringParameters.blogId;

  if (!blogId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: '블로그 ID가 필요합니다.' }),
    };
  }

  try {
    // ✨ 여기를 진짜 API 주소로 바꿔주세요!
    const externalResponse = await fetch(`https://external-api.com/blog/${blogId}`);
    const data = await externalResponse.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '외부 API 호출 중 오류가 발생했습니다.', details: error.message }),
    };
  }
};
