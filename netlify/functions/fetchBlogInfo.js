exports.handler = async (event, context) => {
  const { blogId } = event.queryStringParameters;

  if (!blogId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: '블로그 ID를 입력해주세요.' }),
    };
  }

  try {
    const response = await fetch(`https://external-api.com/blog/${blogId}`);
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '데이터를 가져오는 데 실패했습니다.' }),
    };
  }
};
