const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: '허용되지 않은 메서드입니다.'
    };
  }

  try {
    const { shortCode } = JSON.parse(event.body);
    const { error } = await supabase
      .from('urls')
      .delete()
      .eq('shortcode', shortCode);

    if (error) {
      console.error('❌ 삭제 오류:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: '삭제 실패', error })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: '삭제 완료' })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: '서버 오류', error: err.message })
    };
  }
};
