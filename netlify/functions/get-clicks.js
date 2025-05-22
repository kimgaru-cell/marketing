const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.handler = async function () {
  const { data, error } = await supabase
    .from('urls')
    .select('created_at, short_code, original_url, memo, clicks(count)')
    .order('created_at', { ascending: false });

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }

  // Supabase에서 nested clicks 데이터를 정리
  const formatted = data.map(row => ({
    ...row,
    clicks: row.clicks?.count || 0
  }));

  return {
    statusCode: 200,
    body: JSON.stringify(formatted),
  };
};
