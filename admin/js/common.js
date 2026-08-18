/*
  COMUM A TODAS AS PÁGINAS DO PAINEL ADMIN
  -----------------------------------------
  Cliente Supabase + funções compartilhadas entre login, estoque e
  formulário. Preencha SUPABASE_URL e SUPABASE_ANON_KEY com os dados
  do seu projeto (os mesmos usados em assets/js/vehicles.js).
*/
const SUPABASE_URL = "https://yamvepgzmtvryuzsufev.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_6D5y3XSEpAmanXGK8LM8xg_V_7qKrLd";
const FOTOS_BUCKET = "fotos-veiculos";

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function formatPrice(v) {
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });
}

/* Fotos salvas antes de existir upload (ex: "assets/js/vehicles/spin/spin1.jpg")
   ficam gravadas com caminho relativo à raiz do site. Como as páginas do
   painel vivem uma pasta abaixo da raiz, ajustamos aqui só para exibir a
   prévia — o valor salvo no banco continua intacto. */
function displayUrl(url) {
  if (!url) return url;
  if (/^(https?:)?\/\//.test(url) || url.startsWith('blob:') || url.startsWith('/')) return url;
  return '/' + url;
}

/* Garante que só usuário logado veja a página; senão manda pro login. */
async function requireSession() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) {
    window.location.href = '/admin/index.html';
    return null;
  }
  return session;
}

async function logout() {
  await sb.auth.signOut();
  window.location.href = '/admin/index.html';
}
