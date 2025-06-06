const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // 중요: write 권한이 있는 키 사용
);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  const data = JSON.parse(event.body);

  if (!data.title || !data.description || !data.link) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: '필수 입력값 누락' }),
    };
  }

  const { error } = await supabase.from('banners').insert([{
    title: data.title,
    description: data.description,
    link: data.link,
    image_url: data.image_url || null,
    active: !!data.active,
  }]);

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: '등록 완료' }),
  };
};
