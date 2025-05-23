import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export async function handler(event) {
  const { anonymous_id, user_id } = JSON.parse(event.body || '{}');

  if (!anonymous_id || !user_id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing anonymous_id or user_id' }),
    };
  }

  const { error } = await supabase
    .from('urls')
    .update({ user_id })
    .eq('anonymous_id', anonymous_id);

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'anonymous_id가 user_id로 연결되었습니다.' }),
  };
}
