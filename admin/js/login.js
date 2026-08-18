/* Se já tem sessão ativa, nem mostra o login — vai direto pro estoque. */
(async function redirectIfLogged() {
  const { data: { session } } = await sb.auth.getSession();
  if (session) window.location.href = '/admin/estoque.html';
})();

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const senha = document.getElementById('loginSenha').value;
  const errBox = document.getElementById('loginError');
  const btnEntrar = document.getElementById('btnEntrar');
  errBox.hidden = true;
  btnEntrar.disabled = true;
  btnEntrar.textContent = 'Entrando...';

  const { error } = await sb.auth.signInWithPassword({ email, password: senha });

  if (error) {
    btnEntrar.disabled = false;
    btnEntrar.textContent = 'Entrar';
    errBox.textContent = 'E-mail ou senha inválidos.';
    errBox.hidden = false;
    return;
  }
  window.location.href = '/admin/estoque.html';
});
