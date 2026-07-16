/*
  ESTOQUE DE VEÍCULOS
  --------------------
  Cada veículo é um objeto dentro da lista VEHICLES abaixo.
  Para cadastrar um carro real, copie um bloco { ... } inteiro,
  cole antes do "];" no final do arquivo, e edite os valores.

  CAMPOS:
  - id           : número único (não repita entre os veículos)
  - marca        : ex. "Chevrolet"
  - modelo       : ex. "Onix LT 1.0"
  - tipo         : "hatch", "sedan", "suv" ou "picape" (usado nos filtros)
  - ano          : ano do veículo (número)
  - km           : quilometragem (número, sem pontos)
  - cambio       : "Manual" ou "Automático"
  - combustivel  : ex. "Flex", "Diesel", "Gasolina", "Híbrido", "Elétrico"
  - cor          : ex. "Branco"
  - preco        : preço em reais (número, sem pontos ou vírgulas)
  - desc         : descrição curta que aparece ao clicar no veículo
  - fotos        : lista de caminhos de imagem (veja instruções abaixo)

  COMO ADICIONAR FOTOS REAIS:
  1. Coloque os arquivos de foto dentro da pasta assets/vehicles/
     (crie uma subpasta por carro se preferir, ex: assets/vehicles/onix-2022/)
  2. Use nomes de arquivo sem espaços ou acentos, ex: onix-branco-1.jpg
  3. No campo "fotos", liste os caminhos relativos até essas imagens.
     Exemplo: fotos: ["assets/vehicles/onix-branco-1.jpg", "assets/vehicles/onix-branco-2.jpg"]
  4. A primeira foto da lista é usada na miniatura do card.
     As demais aparecem como galeria ao abrir os detalhes do carro.
  5. Se "fotos" ficar como uma lista vazia [ ], o site usa automaticamente
     um desenho ilustrativo no lugar — assim nada quebra enquanto você
     ainda não tem as fotos daquele carro.

  DICA: fotos entre 1000x750px e 1600x1200px, formato .jpg, já dão ótima
  qualidade sem deixar o site pesado. Evite fotos acima de 500KB cada.
*/

const VEHICLES = [
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
    fotos: ["assets/js/vehicles/spin/spin1.jpg", "assets/js/vehicles/spin/spin2.jpg", "assets/js/vehicles/spin/spin3.jpg", "assets/js/vehicles/spin/spin4.jpg", "assets/js/vehicles/spin/spin5.jpg", "assets/js/vehicles/spin/spin6.jpg", "assets/js/vehicles/spin/spin7.jpg", "assets/js/vehicles/spin/spin8.jpg", "assets/js/vehicles/spin/spin9.jpg", "assets/js/vehicles/spin/spin10.jpg"]
  },
  {
    id: 2,
    marca: "Hyundai",
    modelo: "HB20 Comfort",
    tipo: "hatch",
    ano: 2021,
    km: 45000,
    cambio: "Automático",
    combustivel: "Flex",
    cor: "Prata",
    preco: 72500,
    desc: "HB20 automático em ótimo estado de conservação, pneus novos e revisão em dia.",
    fotos: []
  },
  {
    id: 3,
    marca: "Volkswagen",
    modelo: "Gol 1.6",
    tipo: "hatch",
    ano: 2019,
    km: 68000,
    cambio: "Manual",
    combustivel: "Flex",
    cor: "Preto",
    preco: 52900,
    desc: "Ótima opção de entrada, motor 1.6 econômico, documentação em dia e IPVA quitado.",
    fotos: []
  },
  {
    id: 4,
    marca: "Toyota",
    modelo: "Corolla XEi",
    tipo: "sedan",
    ano: 2020,
    km: 51000,
    cambio: "Automático",
    combustivel: "Flex",
    cor: "Cinza",
    preco: 118900,
    desc: "Corolla XEi top de linha, bancos em couro, central multimídia e piloto automático adaptativo.",
    fotos: []
  },
  {
    id: 5,
    marca: "Honda",
    modelo: "Civic Touring",
    tipo: "sedan",
    ano: 2021,
    km: 38000,
    cambio: "Automático",
    combustivel: "Flex",
    cor: "Branco",
    preco: 142500,
    desc: "Civic Touring turbo, teto solar, painel digital e pacote completo de segurança Honda Sensing.",
    fotos: []
  },
  {
    id: 6,
    marca: "Jeep",
    modelo: "Renegade Longitude",
    tipo: "suv",
    ano: 2022,
    km: 29000,
    cambio: "Automático",
    combustivel: "Flex",
    cor: "Vermelho",
    preco: 129900,
    desc: "Renegade Longitude com baixa quilometragem, central multimídia com Android Auto e Apple CarPlay.",
    fotos: []
  },
  {
    id: 7,
    marca: "Fiat",
    modelo: "Toro Freedom",
    tipo: "picape",
    ano: 2020,
    km: 61000,
    cambio: "Automático",
    combustivel: "Diesel",
    cor: "Cinza",
    preco: 135000,
    desc: "Toro Freedom diesel 4x4, ideal para trabalho e estrada, revisões em dia.",
    fotos: []
  },
  {
    id: 8,
    marca: "Fiat",
    modelo: "Argo Drive",
    tipo: "hatch",
    ano: 2023,
    km: 15000,
    cambio: "Manual",
    combustivel: "Flex",
    cor: "Azul",
    preco: 74900,
    desc: "Argo seminovo, praticamente zero km, ainda na garantia de fábrica.",
    fotos: []
  }
];