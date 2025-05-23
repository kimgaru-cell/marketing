import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export async function handler(event) {
  const { user_id } = JSON.parse(event.body || '{}');

  if (!user_id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing user_id' }),
    };
  }

  const { data, error } = await supabase
    .from('urls')
    .select('*') // select 먼저!
    .eq('user_id', user_id)  // 사용자 ID로 필터링
    .order('created_at', { ascending: false });

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}
