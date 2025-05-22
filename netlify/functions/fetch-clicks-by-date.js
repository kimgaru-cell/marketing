// Supabase와 연결되어 있고, 날짜별 클릭 수를 반환
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

exports.handler = async () => {
  const { data, error } = await supabase
    .from('clicks')
    .select('timestamp')
    .order('timestamp', { ascending: true });

  if (error) return { statusCode: 500, body: JSON.stringify(error) };

  // 날짜별로 집계
  const counts = {};
  data.forEach(row => {
    const date = new Date(row.timestamp).toISOString().split('T')[0];
    counts[date] = (counts[date] || 0) + 1;
  });

  const result = Object.entries(counts).map(([date, click_count]) => ({
    date, click_count
  }));

  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };
};
