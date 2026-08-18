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
const SUPABASE_URL = "https://yamvepgzmtvryuzsufev.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_6D5y3XSEpAmanXGK8LM8xg_V_7qKrLd";
const FOTOS_BUCKET = "fotos-veiculos";

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const viewLogin = document.getElementById('viewLogin');
const viewList = document.getElementById('viewList');
const viewForm = document.getElementById('viewForm');

function showView(view) {
  [viewLogin, viewList, viewForm].forEach(v => v.hidden = true);
  view.hidden = false;
}

/* Fotos salvas antes de existir upload (ex: "assets/js/vehicles/spin/spin1.jpg")
   são gravadas com caminho relativo à raiz do site. Como o painel /admin
   vive uma pasta abaixo da raiz, precisamos ajustar esse caminho só para
   exibir a prévia aqui dentro — o valor salvo no banco continua intacto. */
function displayUrl(url) {
  if (!url) return url;
  if (/^(https?:)?\/\//.test(url) || url.startsWith('blob:') || url.startsWith('/')) return url;
  return '../' + url;
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

let allVehicles = [];

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
  allVehicles = data;
  renderStats();
  renderList();
}

function renderStats() {
  const stats = document.getElementById('adminStats');
  const ativos = allVehicles.filter(v => !v.vendido);
  const vendidos = allVehicles.filter(v => v.vendido);
  const valorEstoque = ativos.reduce((sum, v) => sum + Number(v.preco || 0), 0);

  stats.innerHTML = `
    <div class="stat-card">
      <div class="stat-num">${ativos.length}</div>
      <div class="stat-label">Ativos no site</div>
    </div>
    <div class="stat-card">
      <div class="stat-num">${vendidos.length}</div>
      <div class="stat-label">Vendidos</div>
    </div>
    <div class="stat-card stat-card-wide">
      <div class="stat-num">${formatPrice(valorEstoque)}</div>
      <div class="stat-label">Valor do estoque ativo</div>
    </div>
  `;
}

function renderList() {
  const status = document.getElementById('listStatus');
  const grid = document.getElementById('listGrid');
  const search = document.getElementById('listSearch').value.trim().toLowerCase();
  const filtro = document.getElementById('listFiltro').value;

  let list = allVehicles.filter(v => {
    const text = (v.marca + ' ' + v.modelo).toLowerCase();
    const matchSearch = !search || text.includes(search);
    const matchFiltro = filtro === 'todos' || (filtro === 'ativos' ? !v.vendido : v.vendido);
    return matchSearch && matchFiltro;
  });

  grid.innerHTML = '';
  if (!list.length) {
    status.textContent = 'Nenhum veículo encontrado.';
    return;
  }
  status.textContent = list.length + ' veículo(s) encontrado(s) de ' + allVehicles.length + ' cadastrado(s).';
  list.forEach(v => grid.appendChild(buildCard(v)));
}

document.getElementById('listSearch').addEventListener('input', renderList);
document.getElementById('listFiltro').addEventListener('change', renderList);

function buildCard(v) {
  const el = document.createElement('div');
  el.className = 'admin-card';
  const capa = (v.fotos && v.fotos[0]) ? `<img src="${displayUrl(v.fotos[0])}" alt="">` : '<div class="admin-card-noimg">Sem foto</div>';
  const qtdFotos = v.fotos ? v.fotos.length : 0;
  el.innerHTML = `
    <div class="admin-card-media">
      <span class="admin-card-badge ${v.vendido ? 'sold' : ''}">${v.vendido ? 'Vendido' : '#' + v.id}</span>
      ${qtdFotos ? `<span class="admin-card-photocount">📷 ${qtdFotos}</span>` : ''}
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
const fotoEmpty = document.getElementById('fotoEmpty');
const fotoDropzone = document.getElementById('fotoDropzone');
const fFotosInput = document.getElementById('fFotos');

function renderFotos() {
  fotoPreview.innerHTML = '';
  fotoEmpty.hidden = fotos.length > 0;
  fotos.forEach((f, i) => {
    const item = document.createElement('div');
    item.className = 'foto-item' + (f.uploading ? ' uploading' : '');
    item.draggable = true;
    item.dataset.i = i;
    item.innerHTML = `<img src="${displayUrl(f.url)}" alt="">${i === 0 ? '<span class="foto-capa">Capa</span>' : ''}<button type="button" class="foto-remove">✕</button>`;
    item.querySelector('.foto-remove').addEventListener('click', () => {
      fotos.splice(i, 1);
      renderFotos();
    });
    item.addEventListener('dragstart', () => item.classList.add('dragging'));
    item.addEventListener('dragend', () => item.classList.remove('dragging'));
    item.addEventListener('dragover', (e) => e.preventDefault());
    item.addEventListener('drop', (e) => {
      e.preventDefault();
      const draggingEl = document.querySelector('.foto-item.dragging');
      if (!draggingEl) return;
      const from = Number(draggingEl.dataset.i);
      const to = i;
      const [moved] = fotos.splice(from, 1);
      fotos.splice(to, 0, moved);
      renderFotos();
    });
    fotoPreview.appendChild(item);
  });
}

async function uploadFiles(files) {
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue;
    const placeholder = { url: URL.createObjectURL(file), uploading: true };
    fotos.push(placeholder);
    renderFotos();

    const safeName = file.name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9.]/g, '-');
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
}

fFotosInput.addEventListener('change', () => {
  const files = Array.from(fFotosInput.files);
  fFotosInput.value = '';
  uploadFiles(files);
});

/* Arrastar arquivos do computador direto para a área de fotos */
['dragenter', 'dragover'].forEach(evt => {
  fotoDropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    fotoDropzone.classList.add('drag-active');
  });
});
['dragleave', 'drop'].forEach(evt => {
  fotoDropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    fotoDropzone.classList.remove('drag-active');
  });
});
fotoDropzone.addEventListener('drop', (e) => {
  if (document.querySelector('.foto-item.dragging')) return; // reordenação interna, não upload
  const files = Array.from(e.dataTransfer.files || []);
  if (files.length) uploadFiles(files);
});

/* ---- biblioteca de fotos já existentes no código ---- */
const libraryOverlay = document.getElementById('libraryOverlay');
const libraryBody = document.getElementById('libraryBody');

function renderLibrary() {
  const usadas = new Set(fotos.map(f => f.url));
  libraryBody.innerHTML = (typeof LOCAL_PHOTO_LIBRARY !== 'undefined' ? LOCAL_PHOTO_LIBRARY : []).map(grupo => `
    <div class="library-group">
      <h4>${grupo.grupo}</h4>
      <div class="library-grid">
        ${grupo.fotos.map(url => `
          <button type="button" class="library-thumb ${usadas.has(url) ? 'added' : ''}" data-url="${url}">
            <img src="${displayUrl(url)}" alt="">
            ${usadas.has(url) ? '<span class="library-check">✓</span>' : ''}
          </button>
        `).join('')}
      </div>
    </div>
  `).join('');

  libraryBody.querySelectorAll('.library-thumb').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.dataset.url;
      if (fotos.some(f => f.url === url)) return;
      fotos.push({ url, uploading: false });
      renderFotos();
      renderLibrary();
    });
  });
}

document.getElementById('btnBiblioteca').addEventListener('click', () => {
  renderLibrary();
  libraryOverlay.hidden = false;
});
document.getElementById('libraryClose').addEventListener('click', () => { libraryOverlay.hidden = true; });
libraryOverlay.addEventListener('click', (e) => { if (e.target === libraryOverlay) libraryOverlay.hidden = true; });

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
