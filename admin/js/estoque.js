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
        <a href="/admin/veiculo.html?id=${v.id}" class="btn btn-outline">Editar</a>
        <button class="btn btn-primary btn-toggle">${v.vendido ? 'Reativar' : 'Marcar vendido'}</button>
      </div>
    </div>
  `;
  el.querySelector('.btn-toggle').addEventListener('click', () => toggleVendido(v));
  return el;
}

async function toggleVendido(v) {
  const { error } = await sb.from('veiculos').update({ vendido: !v.vendido }).eq('id', v.id);
  if (error) { alert('Erro ao atualizar: ' + error.message); return; }
  loadList();
}

document.getElementById('listSearch').addEventListener('input', renderList);
document.getElementById('listFiltro').addEventListener('change', renderList);
document.getElementById('btnLogout').addEventListener('click', logout);

(async function init() {
  const session = await requireSession();
  if (!session) return;
  loadList();
})();
