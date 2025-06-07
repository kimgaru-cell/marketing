const { createClient } = require('@supabase/supabase-js');

exports.handler = async () => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY // Netlify에 설정한 값 사용
  );

  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }

  // ✅ 현재 시간
  const now = new Date().toISOString();

  // ✅ 필터링 조건: active + 공개 기간 (start~end)
  const filtered = data.filter((banner) => {
    const active =
      banner.active === true ||
      banner.active === 'TRUE' ||
      banner.active === 'true' ||
      banner.active === 1 ||
      banner.active === '1';

    const startOk = !banner.start_date || banner.start_date <= now;
    const endOk = !banner.end_date || banner.end_date >= now;

    return active && startOk && endOk;
  });

  return {
    statusCode: 200,
    body: JSON.stringify(filtered),
  };
};
