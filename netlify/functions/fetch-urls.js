const { user_id } = JSON.parse(event.body || '{}');

if (!user_id) {
  return {
    statusCode: 400,
    body: JSON.stringify({ error: 'user_id가 필요합니다.' }),
  };
}

const { data, error } = await supabase
  .from('urls')
  .select('*')
  .eq('user_id', user_id)
  .order('created_at', { ascending: false });
