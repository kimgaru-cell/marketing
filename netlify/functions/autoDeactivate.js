const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async () => {
  const { data, error } = await supabase.from('banners').select('*');

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }

  const now = new Date().toISOString();
  const expired = data.filter(b => b.end_date && b.end_date < now && b.active === true);

  for (const banner of expired) {
    await supabase
      .from('banners')
      .update({ active: false })
      .eq('id', banner.id);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: `${expired.length}개 비활성화 완료` }),
  };
};
