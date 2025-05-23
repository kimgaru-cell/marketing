<script type="module">
  import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

  const supabase = createClient(
    'https://azdnwqrirgpedwcuaqdi.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6ZG53cXJpcmdwZWR3Y3VhcWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MDU4NTIsImV4cCI6MjA2MzM4MTg1Mn0.wpsdKaG0XWwWRXrXVHzwliZ99EYjvHpAizqQbu5djn8'
  )

  // 로그인
  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("로그인 실패: " + error.message);
    else location.reload();
  }

  // 회원가입
  async function signUp(email, password) {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert("가입 실패: " + error.message);
    else alert("가입 성공! 이메일을 확인하세요.");
  }

  // 로그아웃
  async function signOut() {
    await supabase.auth.signOut();
    location.reload();
  }

  // 로그인된 사용자 정보
  const { data: { user } } = await supabase.auth.getUser();
  console.log("현재 로그인된 사용자:", user);
</script>
