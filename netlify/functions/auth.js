<script type="module">
  import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

  const supabase = createClient(
    'https://YOUR_SUPABASE_URL.supabase.co',
    'YOUR_PUBLIC_ANON_KEY'
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
