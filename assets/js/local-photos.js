/*
  BIBLIOTECA DE FOTOS JÁ EXISTENTES NO CÓDIGO
  --------------------------------------------
  Antes de existir upload pelo painel /admin, as fotos dos veículos
  ficavam salvas direto na pasta assets/js/vehicles/<modelo>/. Esses
  arquivos continuam no repositório e ainda são usados por alguns
  veículos cadastrados no banco.

  Este arquivo só serve para o painel admin poder listar essas fotos
  numa "biblioteca" e permitir reaproveitá-las num veículo sem precisar
  reenviar tudo de novo. Se você adicionar fotos novas direto nessas
  pastas (fora do painel), inclua o nome do arquivo aqui também.
*/
const LOCAL_PHOTO_LIBRARY = [
  {
    grupo: "Spin",
    pasta: "assets/js/vehicles/spin",
    arquivos: ["spin1.jpg","spin2.jpg","spin3.jpg","spin4.jpg","spin5.jpg","spin6.jpg","spin7.jpg","spin8.jpg","spin9.jpg","spin10.jpg"]
  },
  {
    grupo: "Prisma",
    pasta: "assets/js/vehicles/prisma",
    arquivos: ["prisma1.jpg","prisma2.jpg","prisma3.jpg","prisma4.jpg","prisma5.jpg","prisma6.jpg","prisma7.jpg","prisma8.jpg","prisma9.jpg","prisma10.jpg","prisma11.jpg","prisma12.jpg","prisma13.jpg","prisma14.jpg"]
  },
  {
    grupo: "Agile",
    pasta: "assets/js/vehicles/agile",
    arquivos: ["agile1.jpeg","agile2.jpeg","agile3.jpeg","agile4.jpeg","agile5.jpeg","agile6.jpeg","agile7.jpeg","agile8.jpeg","agile9.jpeg","agile10.jpeg","agile11.jpeg","agile12.jpeg","agile14.jpeg","agile15.jpeg"]
  },
  {
    grupo: "Montana",
    pasta: "assets/js/vehicles/montana",
    arquivos: ["montana1.jpeg","montana2.jpeg","montana3.jpeg","montana4.jpeg","montana5.jpeg","montana6.jpeg","montana7.jpeg","montana8.jpeg","montana9.jpeg","montana10.jpeg","montana11.jpeg"]
  },
  {
    grupo: "Strada",
    pasta: "assets/js/vehicles/strada",
    arquivos: ["strada1.jpeg","strada2.jpeg","strada3.jpeg","strada4.jpeg","strada5.jpeg","strada6.jpeg","strada7.jpeg","strada8.jpeg","strada9.jpeg","strada10.jpeg","strada11.jpeg","strada12.jpeg"]
  }
].map(g => ({
  ...g,
  fotos: g.arquivos.map(nome => `${g.pasta}/${nome}`)
}));
