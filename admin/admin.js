/*
  PAINEL ADMIN — MP VEÍCULOS
  --------------------------
  Preencha SUPABASE_URL e SUPABASE_ANON_KEY com os dados do seu
  projeto (os mesmos usados em assets/js/vehicles.js).
  Quem consegue logar aqui é só quem tiver um usuário criado em
  Authentication > Users no painel do Supabase — a chave "anon"
  sozinha não dá permissão de escrita (isso é garantido pelas
  políticas RLS em database/schema.sql).
*/
const SUPABASE_URL = "COLE_AQUI_A_URL_DO_SEU_PROJETO_SUPABASE";
const SUPABASE_ANON_KEY = "COLE_AQUI_A_ANON_KEY_DO_SEU_PROJETO_SUPABASE";
const FOTOS_BUCKET = "fotos-veiculos";

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const viewLogin = document.getElementById('viewLogin');
const viewList = document.getElementById('viewList');
const viewForm = document.getElementById('viewForm');

function showView(view) {
  [viewLogin, viewList, viewForm].forEach(v => v.hidden = true);
  view.hidden = false;
}

/* ---------- SESSÃO / LOGIN ---------- */
async function checkSession() {
  const { data: { session } } = await sb.auth.getSession();
  if (session) {
    showView(viewList);
    loadList();
  } else {
    showView(viewLogin);
  }
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const senha = document.getElementById('loginSenha').value;
  const errBox = document.getElementById('loginError');
  errBox.hidden = true;

  const { error } = await sb.auth.signInWithPassword({ email, password: senha });
  if (error) {
    errBox.textContent = 'E-mail ou senha inválidos.';
    errBox.hidden = false;
    return;
  }
  showView(viewList);
  loadList();
});

document.getElementById('btnLogout').addEventListener('click', async () => {
  await sb.auth.signOut();
  showView(viewLogin);
});

/* ---------- LISTA ---------- */
function formatPrice(v) {
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });
}

async function loadList() {
  const status = document.getElementById('listStatus');
  const grid = document.getElementById('listGrid');
  status.textContent = 'Carregando estoque...';
  grid.innerHTML = '';

  const { data, error } = await sb.from('veiculos').select('*').order('criado_em', { ascending: false });
  if (error) {
    status.textContent = 'Erro ao carregar: ' + error.message;
    return;
  }
  status.textContent = data.length + ' veículo(s) cadastrado(s).';
  data.forEach(v => grid.appendChild(buildCard(v)));
}

function buildCard(v) {
  const el = document.createElement('div');
  el.className = 'admin-card';
  const capa = (v.fotos && v.fotos[0]) ? `<img src="${v.fotos[0]}" alt="">` : '';
  el.innerHTML = `
    <div class="admin-card-media">
      <span class="admin-card-badge ${v.vendido ? 'sold' : ''}">${v.vendido ? 'Vendido' : '#' + v.id}</span>
      ${capa}
    </div>
    <div class="admin-card-body">
      <div class="admin-card-title">${v.marca} ${v.modelo}</div>
      <div class="admin-card-sub">${v.ano} · ${(v.km/1000).toFixed(0)}k km · ${v.cambio}</div>
      <div class="admin-card-price">${formatPrice(v.preco)}</div>
      <div class="admin-card-actions">
        <button class="btn btn-ghost btn-edit">Editar</button>
        <button class="btn btn-primary btn-toggle">${v.vendido ? 'Reativar' : 'Marcar vendido'}</button>
      </div>
    </div>
  `;
  el.querySelector('.btn-edit').addEventListener('click', () => openForm(v));
  el.querySelector('.btn-toggle').addEventListener('click', () => toggleVendido(v));
  return el;
}

async function toggleVendido(v) {
  const { error } = await sb.from('veiculos').update({ vendido: !v.vendido }).eq('id', v.id);
  if (error) { alert('Erro ao atualizar: ' + error.message); return; }
  loadList();
}

document.getElementById('btnNovo').addEventListener('click', () => openForm(null));
document.getElementById('btnVoltar').addEventListener('click', () => { showView(viewList); loadList(); });

/* ---------- FORMULÁRIO ---------- */
let editingId = null;
let fotos = []; // [{url, uploading}]

function openForm(v) {
  editingId = v ? v.id : null;
  document.getElementById('formTitle').textContent = v ? 'Editar veículo' : 'Novo veículo';
  document.getElementById('formError').hidden = true;
  document.getElementById('btnExcluir').hidden = !v;

  document.getElementById('fMarca').value = v ? v.marca : '';
  document.getElementById('fModelo').value = v ? v.modelo : '';
  document.getElementById('fTipo').value = v ? v.tipo : 'hatch';
  document.getElementById('fAno').value = v ? v.ano : '';
  document.getElementById('fKm').value = v ? v.km : '';
  document.getElementById('fCambio').value = v ? v.cambio : 'Manual';
  document.getElementById('fCombustivel').value = v ? v.combustivel : '';
  document.getElementById('fCor').value = v ? v.cor : '';
  document.getElementById('fPreco').value = v ? v.preco : '';
  document.getElementById('fCapaFoco').value = v && v.capa_foco ? v.capa_foco : '';
  document.getElementById('fDesc').value = v ? (v.descricao || '') : '';
  document.getElementById('fVendido').checked = v ? !!v.vendido : false;

  destaques = v && v.destaques ? [...v.destaques] : [];
  renderChips();

  fotos = v && v.fotos ? v.fotos.map(url => ({ url, uploading: false })) : [];
  renderFotos();

  showView(viewForm);
}

document.getElementById('btnVoltar').addEventListener('click', () => showView(viewList));

/* ---- destaques (chips) ---- */
let destaques = [];
const chipList = document.getElementById('chipList');
const destaqueInput = document.getElementById('fDestaqueInput');

function renderChips() {
  chipList.innerHTML = destaques.map((d, i) => `
    <span class="chip">${d}<button type="button" data-i="${i}">✕</button></span>
  `).join('');
  chipList.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      destaques.splice(Number(btn.dataset.i), 1);
      renderChips();
    });
  });
}
destaqueInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    const val = destaqueInput.value.trim();
    if (val) { destaques.push(val); destaqueInput.value = ''; renderChips(); }
  }
});

/* ---- fotos (upload + reordenar + remover) ---- */
const fotoPreview = document.getElementById('fotoPreview');
const fFotosInput = document.getElementById('fFotos');

function renderFotos() {
  fotoPreview.innerHTML = '';
  fotos.forEach((f, i) => {
    const item = document.createElement('div');
    item.className = 'foto-item' + (f.uploading ? ' uploading' : '');
    item.draggable = true;
    item.dataset.i = i;
    item.innerHTML = `<img src="${f.url}" alt=""><button type="button" class="foto-remove">✕</button>`;
    item.querySelector('.foto-remove').addEventListener('click', () => {
      fotos.splice(i, 1);
      renderFotos();
    });
    item.addEventListener('dragstart', () => item.classList.add('dragging'));
    item.addEventListener('dragend', () => item.classList.remove('dragging'));
    item.addEventListener('dragover', (e) => e.preventDefault());
    item.addEventListener('drop', (e) => {
      e.preventDefault();
      const from = Number(document.querySelector('.foto-item.dragging').dataset.i);
      const to = i;
      const [moved] = fotos.splice(from, 1);
      fotos.splice(to, 0, moved);
      renderFotos();
    });
    fotoPreview.appendChild(item);
  });
}

fFotosInput.addEventListener('change', async () => {
  const files = Array.from(fFotosInput.files);
  fFotosInput.value = '';
  for (const file of files) {
    const placeholder = { url: URL.createObjectURL(file), uploading: true };
    fotos.push(placeholder);
    renderFotos();

    const safeName = file.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9.]/g, '-');
    const path = `${Date.now()}-${safeName}`;
    const { error } = await sb.storage.from(FOTOS_BUCKET).upload(path, file, { upsert: false });
    if (error) {
      alert('Erro ao enviar foto: ' + error.message);
      fotos = fotos.filter(f => f !== placeholder);
      renderFotos();
      continue;
    }
    const { data: pub } = sb.storage.from(FOTOS_BUCKET).getPublicUrl(path);
    placeholder.url = pub.publicUrl;
    placeholder.uploading = false;
    renderFotos();
  }
});

/* ---- salvar / excluir ---- */
document.getElementById('vehicleForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const errBox = document.getElementById('formError');
  errBox.hidden = true;

  if (fotos.some(f => f.uploading)) {
    errBox.textContent = 'Aguarde o envio das fotos terminar antes de salvar.';
    errBox.hidden = false;
    return;
  }

  const payload = {
    marca: document.getElementById('fMarca').value.trim(),
    modelo: document.getElementById('fModelo').value.trim(),
    tipo: document.getElementById('fTipo').value,
    ano: Number(document.getElementById('fAno').value),
    km: Number(document.getElementById('fKm').value),
    cambio: document.getElementById('fCambio').value,
    combustivel: document.getElementById('fCombustivel').value.trim(),
    cor: document.getElementById('fCor').value.trim(),
    preco: Number(document.getElementById('fPreco').value),
    capa_foco: document.getElementById('fCapaFoco').value.trim() || null,
    descricao: document.getElementById('fDesc').value.trim(),
    destaques,
    fotos: fotos.map(f => f.url),
    vendido: document.getElementById('fVendido').checked
  };

  const btnSalvar = document.getElementById('btnSalvar');
  btnSalvar.disabled = true;
  btnSalvar.textContent = 'Salvando...';

  const { error } = editingId
    ? await sb.from('veiculos').update(payload).eq('id', editingId)
    : await sb.from('veiculos').insert(payload);

  btnSalvar.disabled = false;
  btnSalvar.textContent = 'Salvar veículo';

  if (error) {
    errBox.textContent = 'Erro ao salvar: ' + error.message;
    errBox.hidden = false;
    return;
  }
  showView(viewList);
  loadList();
});

document.getElementById('btnExcluir').addEventListener('click', async () => {
  if (!editingId) return;
  if (!confirm('Excluir este veículo definitivamente? Essa ação não pode ser desfeita.')) return;
  const { error } = await sb.from('veiculos').delete().eq('id', editingId);
  if (error) { alert('Erro ao excluir: ' + error.message); return; }
  showView(viewList);
  loadList();
});

checkSession();
