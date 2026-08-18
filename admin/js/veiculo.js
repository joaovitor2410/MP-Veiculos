const params = new URLSearchParams(window.location.search);
const editingId = params.get('id') ? Number(params.get('id')) : null;

let destaques = [];
let fotos = []; // [{url, uploading}]

const chipList = document.getElementById('chipList');
const destaqueInput = document.getElementById('fDestaqueInput');
const fotoPreview = document.getElementById('fotoPreview');
const fotoEmpty = document.getElementById('fotoEmpty');
const fotoDropzone = document.getElementById('fotoDropzone');
const fFotosInput = document.getElementById('fFotos');
const libraryOverlay = document.getElementById('libraryOverlay');
const libraryBody = document.getElementById('libraryBody');

function fillForm(v) {
  document.getElementById('formTitle').textContent = v ? 'Editar veículo' : 'Novo veículo';
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
}

/* ---- destaques (chips) ---- */
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

    const safeName = stripAccents(file.name).replace(/[^a-zA-Z0-9.]/g, '-');
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

function stripAccents(str) {
  const from = 'áàâãäåéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÅÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ';
  const to   = 'aaaaaaeeeeiiiiooooouuuucnAAAAAAEEEEIIIIOOOOOUUUUCN';
  return str.split('').map(ch => {
    const i = from.indexOf(ch);
    return i > -1 ? to[i] : ch;
  }).join('');
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
  window.location.href = '/admin/estoque.html';
});

document.getElementById('btnExcluir').addEventListener('click', async () => {
  if (!editingId) return;
  if (!confirm('Excluir este veículo definitivamente? Essa ação não pode ser desfeita.')) return;
  const { error } = await sb.from('veiculos').delete().eq('id', editingId);
  if (error) { alert('Erro ao excluir: ' + error.message); return; }
  window.location.href = '/admin/estoque.html';
});

(async function init() {
  const session = await requireSession();
  if (!session) return;

  if (editingId) {
    const { data, error } = await sb.from('veiculos').select('*').eq('id', editingId).single();
    if (error || !data) {
      alert('Veículo não encontrado.');
      window.location.href = '/admin/estoque.html';
      return;
    }
    fillForm(data);
  } else {
    fillForm(null);
  }
})();
