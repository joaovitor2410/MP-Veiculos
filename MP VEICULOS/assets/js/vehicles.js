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
    marca: "Chevrolet",
    modelo: "Prisma 1.4 LTZ",
    tipo: "sedan",
    ano: 2014,
    km: 109893,
    cambio: "Manual",
    combustivel: "Flex",
    cor: "Preto",
    preco: 49900,
    desc: "CHEVROLET PRISMA LTZ 1.4 2014, sedan completo, econômico e muito bem conservado. Equipado com motor 1.4, direção hidráulica, ar-condicionado, airbag duplo, alarme, travas elétricas, vidros elétricos, retrovisores elétricos, kit multimídia MyLink, câmera de ré, sensor de ré, computador de bordo e rodas aro 15. Veículo emplacado 2026, pronto para rodar, oferecendo conforto, segurança e excelente custo-benefício para o dia a dia.",
    fotos: ["assets/js/vehicles/prisma/prisma1.jpg", "assets/js/vehicles/prisma/prisma2.jpg", "assets/js/vehicles/prisma/prisma3.jpg", "assets/js/vehicles/prisma/prisma4.jpg", "assets/js/vehicles/prisma/prisma5.jpg", "assets/js/vehicles/prisma/prisma6.jpg", "assets/js/vehicles/prisma/prisma7.jpg", "assets/js/vehicles/prisma/prisma8.jpg", "assets/js/vehicles/prisma/prisma9.jpg", "assets/js/vehicles/prisma/prisma10.jpg", "assets/js/vehicles/prisma/prisma11.jpg", "assets/js/vehicles/prisma/prisma12.jpg", "assets/js/vehicles/prisma/prisma13.jpg", "assets/js/vehicles/prisma/prisma14.jpg"]
  },
  {
    id: 3,
    marca: "Chevrolet",
    modelo: "Agile LTZ 1.4",
    tipo: "hatch",
    ano: 2013,
    km: 114283,
    cambio: "Manual",
    combustivel: "Flex",
    cor: "Prata",
    preco: 35900,
    desc: "CHEVROLET AGILE LTZ 1.4 2013, hatch completo, confortável e muito bem conservado. Equipado com motor 1.4, direção elétrica, ar-condicionado, airbag duplo, alarme, travas elétricas, vidros elétricos, retrovisores elétricos, som, câmera de ré, sensor de ré, computador de bordo e rodas aro 15. Veículo emplacado 2026, pronto para rodar, unindo economia, conforto, segurança e excelente desempenho para o dia a dia.",
    fotos: ["assets/js/vehicles/agile/agile1.jpeg", "assets/js/vehicles/agile/agile2.jpeg", "assets/js/vehicles/agile/agile3.jpeg", "assets/js/vehicles/agile/agile4.jpeg", "assets/js/vehicles/agile/agile5.jpeg", "assets/js/vehicles/agile/agile6.jpeg", "assets/js/vehicles/agile/agile7.jpeg", "assets/js/vehicles/agile/agile8.jpeg", "assets/js/vehicles/agile/agile9.jpeg", "assets/js/vehicles/agile/agile10.jpeg", "assets/js/vehicles/agile/agile11.jpeg", "assets/js/vehicles/agile/agile12.jpeg","assets/js/vehicles/agile/agile14.jpeg", "assets/js/vehicles/agile/agile15.jpeg"]
  },
  {
    id: 4,
    marca: "Chevrolet",
    modelo: "Montana LS 1.4",
    tipo: "picape",
    ano: 2012,
    km: 326843,
    cambio: "Manual",
    combustivel: "Flex",
    cor: "Cinza",
    preco: 42900,
    desc: "CHEVROLET MONTANA LS 1.4 2012, picape versátil, econômica e muito bem conservada. Equipada com motor 1.4, direção hidráulica, ar-condicionado, airbag duplo, alarme, travas elétricas, vidros elétricos, retrovisores manuais, som, sensor de ré e rodas aro 15. Veículo emplacado 2026, pronto para rodar, ideal para quem busca praticidade, economia e resistência tanto para o trabalho quanto para o uso diário.",
    fotos: ["assets/js/vehicles/montana/montana1.jpeg", "assets/js/vehicles/montana/montana2.jpeg", "assets/js/vehicles/montana/montana3.jpeg", "assets/js/vehicles/montana/montana4.jpeg", "assets/js/vehicles/montana/montana5.jpeg", "assets/js/vehicles/montana/montana6.jpeg", "assets/js/vehicles/montana/montana7.jpeg", "assets/js/vehicles/montana/montana8.jpeg", "assets/js/vehicles/montana/montana9.jpeg", "assets/js/vehicles/montana/montana10.jpeg", "assets/js/vehicles/montana/montana11.jpeg"]
  },
  {
    id: 5,
    marca: "Fiat",
    modelo: "Strada Freedom 1.3 CD",
    tipo: "picape",
    ano: 2024,
    km: 57044,
    cambio: "Manual",
    combustivel: "Flex",
    cor: "Branco",
    preco: 98900,
    desc: "FIAT STRADA FREEDOM 1.3 CD 2024, único dono, picape moderna, completa e em excelente estado de conservação. Equipada com motor 1.3, direção elétrica, airbag duplo, ar-condicionado, alarme com chave canivete, travas elétricas, vidros elétricos, retrovisores elétricos, som original, sensor de ré, computador de bordo e rodas aro 15. Veículo emplacado 2026, pronto para rodar, oferecendo conforto, tecnologia, economia e a versatilidade ideal para o trabalho e o uso diário.",
    fotos: ["assets/js/vehicles/strada/strada1.jpeg", "assets/js/vehicles/strada/strada2.jpeg", "assets/js/vehicles/strada/strada3.jpeg", "assets/js/vehicles/strada/strada4.jpeg", "assets/js/vehicles/strada/strada5.jpeg", "assets/js/vehicles/strada/strada6.jpeg", "assets/js/vehicles/strada/strada7.jpeg", "assets/js/vehicles/strada/strada8.jpeg", "assets/js/vehicles/strada/strada9.jpeg", "assets/js/vehicles/strada/strada10.jpeg", "assets/js/vehicles/strada/strada11.jpeg", "assets/js/vehicles/strada/strada12.jpeg"]
  },

];