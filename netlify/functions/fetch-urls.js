import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export async function handler(event) {
  let body;

  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: '잘못된 JSON입니다.' }),
    };
  }

  const { user_id, anonymous_id } = body;

  if (!user_id && !anonymous_id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'user_id와 anonymous_id 모두 없습니다.' }),
    };
  }

  let filter = '';
  if (user_id && anonymous_id) {
    filter = `user_id.eq.${user_id},anonymous_id.eq.${anonymous_id}`;
  } else if (user_id) {
    filter = `user_id.eq.${user_id}`;
  } else {
    filter = `anonymous_id.eq.${anonymous_id}`;
  }

  const { data, error } = await supabase
    .from('urls')
    .select('*')
    .or(filter)
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
