/*
  ESTOQUE DE VEÍCULOS — agora vem do banco (Supabase), não mais fixo aqui.
  --------------------------------------------------------------------
  Esse arquivo faz uma requisição para o banco de dados, transforma o
  resultado no mesmo formato que o main.js já espera (VEHICLES = [...]),
  e só então carrega o main.js. Assim nenhuma outra parte do site
  precisa mudar.

  Se o carro for cadastrado, editado ou removido pelo painel em /admin,
  ele aparece aqui automaticamente — sem precisar editar código nem
  fazer novo deploy.

  Em caso de falha de rede (ou banco fora do ar), o site usa a lista
  de backup no fim deste arquivo, pra nunca ficar com a página vazia.
*/

// Preencha com os dados do SEU projeto Supabase
// (Settings > API, no painel do Supabase). A "anon key" é pública por
// natureza — ela só permite leitura, protegida pelas políticas (RLS)
// definidas em database/schema.sql. Não é um segredo.
const SUPABASE_URL = "COLE_AQUI_A_URL_DO_SEU_PROJETO_SUPABASE";
const SUPABASE_ANON_KEY = "COLE_AQUI_A_ANON_KEY_DO_SEU_PROJETO_SUPABASE";

let VEHICLES = [];

function mapRow(r) {
  return {
    id: r.id,
    marca: r.marca,
    modelo: r.modelo,
    tipo: r.tipo,
    ano: r.ano,
    km: r.km,
    cambio: r.cambio,
    combustivel: r.combustivel,
    cor: r.cor,
    preco: Number(r.preco),
    desc: r.descricao,
    destaques: r.destaques || [],
    capaFoco: r.capa_foco || null,
    fotos: r.fotos || []
  };
}

async function loadVehicles() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/veiculos?select=*&vendido=eq.false&order=criado_em.desc`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`
        }
      }
    );
    if (!res.ok) throw new Error("Resposta não OK do Supabase: " + res.status);
    const rows = await res.json();
    VEHICLES = rows.map(mapRow);
  } catch (err) {
    console.error("Não foi possível carregar o estoque do banco. Usando lista de backup.", err);
    VEHICLES = VEHICLES_BACKUP;
  }

  // Só carrega o restante da lógica do site (main.js) depois que o
  // estoque já está pronto em memória.
  const script = document.createElement("script");
  script.src = "assets/js/main.js";
  document.body.appendChild(script);
}

// ---------- LISTA DE BACKUP ----------
// Usada só se o banco não responder. Mantenha alguns carros aqui como
// rede de segurança (pode ser uma cópia do que está cadastrado hoje).
const VEHICLES_BACKUP = [
  {
    id: 1,
    marca: "Chevrolet",
    modelo: "Spin 1.8 Active",
    tipo: "suv",
    ano: 2023,
    km: 48065,
    cambio: "Automático",
    combustivel: "Flex",
    cor: "Preto",
    preco: 96900,
    desc: "Spin 1.8 Active completo, único dono, todas as revisões feitas na concessionária. Ar-condicionado, direção elétrica, multimídia de fábrica, câmera de ré, vidros elétricos .",
    destaques: ["Único dono", "Revisões na concessionária", "Câmbio automático", "Ar-condicionado", "Direção elétrica", "Multimídia de fábrica", "Câmera de ré", "Vidros elétricos"],
    fotos: ["assets/js/vehicles/spin/spin1.jpg", "assets/js/vehicles/spin/spin2.jpg", "assets/js/vehicles/spin/spin3.jpg"]
  }
];

loadVehicles();
