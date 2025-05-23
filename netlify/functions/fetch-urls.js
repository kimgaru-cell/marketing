import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export async function handler(event) {
  const { user_id } = JSON.parse(event.body || '{}');

  if (!user_id && !anonymous_id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'user_id와 anonymous_id 모두 없습니다.' }),
    };
  }

  const { data, error } = await supabase
    .from('urls')
    .select('*') // select 먼저!
    .or(user_id && anonymous_id
      ? `user_id.eq.${user_id},anonymous_id.eq.${anonymous_id}`
      : user_id
        ? `user_id.eq.${user_id}`
        : `anonymous_id.eq.${anonymous_id}`)
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
