const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async function(event) {
  console.log("📥 요청 수신됨");

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: 'POST 방식만 허용됩니다.'
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { originalUrl, userId, anonymousId } = body;
    console.log("▶ 받은 데이터:", body);

    if (!originalUrl || !/^https?:\/\//.test(originalUrl)) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: '올바른 URL을 입력해주세요.'
      };
    }

    // 중복 방지용 코드 (선택사항)
    let shortcode;
    let isUnique = false;
    do {
      shortcode = Math.random().toString(36).substring(2, 8);
      const { data } = await supabase.from('urls').select('id').eq('shortcode', shortcode).single();
      if (!data) isUnique = true;
    } while (!isUnique);

    const { error } = await supabase.from('urls').insert([{
      shortcode,
      original_url: originalUrl,
      user_id: userId || null,
      anonymous_id: !userId ? anonymousId : null
    }]);

    if (error) {
      console.error("❌ Supabase 삽입 오류:", error);
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ message: 'Supabase 삽입 실패', detail: error.message })
      };
    }

    console.log("✅ 삽입 성공, shortcode:", shortcode);
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ shortCode: shortcode })
    };

  } catch (err) {
    console.error("❌ 서버 예외 발생:", err);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: '서버 오류', error: err.message })
    };
  }
};
