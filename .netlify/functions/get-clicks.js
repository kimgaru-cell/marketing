// get-clicks.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.handler = async function (event, context) {
  const { shortCode } = JSON.parse(event.body);

  const { data, error } = await supabase
    .from('clicks') // 클릭 수를 저장한 테이블
    .select('count')
    .eq('short_code', shortCode)
    .single();

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ count: data.count || 0 }),
  };
};
