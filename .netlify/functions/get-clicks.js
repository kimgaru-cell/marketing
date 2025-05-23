const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_KEY
);

exports.handler = async function () {
  const { shortCode } = JSON.parse(event.body);
  
  const { data, error } = await supabase
    .from('urls')
    .select('*', { count: 'exact', head: true })
    .eq('shortcode', shortCode);

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: '에러 발생', error })
    };
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify(formatted),
  };
};
