-- ============================================================
-- MP VEÍCULOS — SCHEMA DO SUPABASE
-- ============================================================
-- Como usar:
-- 1. Crie um projeto em https://supabase.com (plano free já serve)
-- 2. Abra "SQL Editor" no menu lateral do projeto
-- 3. Cole este arquivo inteiro e clique em "Run"
-- 4. Depois vá em "Authentication" > "Users" > "Add user" e crie
--    o usuário admin (o e-mail/senha que você vai usar pra logar
--    no painel /admin)
-- ============================================================

-- ---------- TABELA DE VEÍCULOS ----------
create table if not exists veiculos (
  id            bigint generated always as identity primary key,
  marca         text not null,
  modelo        text not null,
  tipo          text not null check (tipo in ('hatch','sedan','suv','picape')),
  ano           int  not null,
  km            int  not null default 0,
  cambio        text not null check (cambio in ('Manual','Automático')),
  combustivel   text not null,
  cor           text not null,
  preco         numeric not null,
  descricao     text,
  destaques     jsonb not null default '[]',   -- lista de strings, ex: ["Único dono","Ar-condicionado"]
  capa_foco     text,                           -- ex: "20%" (mesmo uso do capaFoco atual)
  fotos         jsonb not null default '[]',    -- lista de URLs públicas das fotos no Storage
  vendido       boolean not null default false, -- oculta do site público sem apagar o registro
  criado_em     timestamptz not null default now()
);

comment on table veiculos is 'Estoque de veículos exibido no site público e gerenciado pelo painel /admin';

-- ---------- SEGURANÇA (Row Level Security) ----------
-- A chave "anon" usada no site público consegue LER, mas nunca
-- escrever. Só um usuário autenticado (o admin logado no painel)
-- pode inserir, editar ou excluir.
alter table veiculos enable row level security;

create policy "Leitura pública do estoque"
  on veiculos for select
  to anon, authenticated
  using (true);

create policy "Admin insere veículos"
  on veiculos for insert
  to authenticated
  with check (true);

create policy "Admin edita veículos"
  on veiculos for update
  to authenticated
  using (true)
  with check (true);

create policy "Admin exclui veículos"
  on veiculos for delete
  to authenticated
  using (true);

-- ---------- STORAGE DAS FOTOS ----------
insert into storage.buckets (id, name, public)
values ('fotos-veiculos', 'fotos-veiculos', true)
on conflict (id) do nothing;

create policy "Leitura pública das fotos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'fotos-veiculos');

create policy "Admin envia fotos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'fotos-veiculos');

create policy "Admin exclui fotos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'fotos-veiculos');

-- ---------- (OPCIONAL) MIGRAR OS 5 VEÍCULOS ATUAIS ----------
-- Já deixa o painel populado com o que está hoje no vehicles.js.
-- Pode editar/apagar essas linhas depois, direto pelo painel.
insert into veiculos (marca, modelo, tipo, ano, km, cambio, combustivel, cor, preco, descricao, destaques, capa_foco, fotos, vendido)
values
('Chevrolet','Spin 1.8 Active','suv',2023,48065,'Automático','Flex','Preto',96900,
 'Spin 1.8 Active completo, único dono, todas as revisões feitas na concessionária. Ar-condicionado, direção elétrica, multimídia de fábrica, câmera de ré, vidros elétricos .',
 '["Único dono","Revisões na concessionária","Câmbio automático","Ar-condicionado","Direção elétrica","Multimídia de fábrica","Câmera de ré","Vidros elétricos"]',
 null,
 '["assets/js/vehicles/spin/spin1.jpg","assets/js/vehicles/spin/spin2.jpg","assets/js/vehicles/spin/spin3.jpg","assets/js/vehicles/spin/spin4.jpg","assets/js/vehicles/spin/spin5.jpg","assets/js/vehicles/spin/spin6.jpg","assets/js/vehicles/spin/spin7.jpg","assets/js/vehicles/spin/spin8.jpg","assets/js/vehicles/spin/spin9.jpg","assets/js/vehicles/spin/spin10.jpg"]',
 false),
('Chevrolet','Prisma 1.4 LTZ','sedan',2014,109893,'Manual','Flex','Preto',49900,
 'CHEVROLET PRISMA LTZ 1.4 2014, sedan completo, econômico e muito bem conservado. Equipado com motor 1.4, direção hidráulica, ar-condicionado, airbag duplo, alarme, travas elétricas, vidros elétricos, retrovisores elétricos, kit multimídia MyLink, câmera de ré, sensor de ré, computador de bordo e rodas aro 15. Veículo emplacado 2026, pronto para rodar, oferecendo conforto, segurança e excelente custo-benefício para o dia a dia.',
 '["Motor 1.4 econômico","Direção hidráulica","Ar-condicionado","Airbag duplo","Multimídia MyLink","Câmera + sensor de ré","Computador de bordo","Emplacado 2026"]',
 null,
 '["assets/js/vehicles/prisma/prisma1.jpg","assets/js/vehicles/prisma/prisma2.jpg","assets/js/vehicles/prisma/prisma3.jpg","assets/js/vehicles/prisma/prisma4.jpg","assets/js/vehicles/prisma/prisma5.jpg","assets/js/vehicles/prisma/prisma6.jpg","assets/js/vehicles/prisma/prisma7.jpg","assets/js/vehicles/prisma/prisma8.jpg","assets/js/vehicles/prisma/prisma9.jpg","assets/js/vehicles/prisma/prisma10.jpg","assets/js/vehicles/prisma/prisma11.jpg","assets/js/vehicles/prisma/prisma12.jpg","assets/js/vehicles/prisma/prisma13.jpg","assets/js/vehicles/prisma/prisma14.jpg"]',
 false),
('Chevrolet','Agile LTZ 1.4','hatch',2013,114283,'Manual','Flex','Prata',35900,
 'CHEVROLET AGILE LTZ 1.4 2013, hatch completo, confortável e muito bem conservado. Equipado com motor 1.4, direção elétrica, ar-condicionado, airbag duplo, alarme, travas elétricas, vidros elétricos, retrovisores elétricos, som, câmera de ré, sensor de ré, computador de bordo e rodas aro 15. Veículo emplacado 2026, pronto para rodar, unindo economia, conforto, segurança e excelente desempenho para o dia a dia.',
 '["Motor 1.4","Direção elétrica","Ar-condicionado","Airbag duplo","Câmera + sensor de ré","Computador de bordo","Rodas aro 15","Emplacado 2026"]',
 null,
 '["assets/js/vehicles/agile/agile1.jpeg","assets/js/vehicles/agile/agile2.jpeg","assets/js/vehicles/agile/agile3.jpeg","assets/js/vehicles/agile/agile4.jpeg","assets/js/vehicles/agile/agile5.jpeg","assets/js/vehicles/agile/agile6.jpeg","assets/js/vehicles/agile/agile7.jpeg","assets/js/vehicles/agile/agile8.jpeg","assets/js/vehicles/agile/agile9.jpeg","assets/js/vehicles/agile/agile10.jpeg","assets/js/vehicles/agile/agile11.jpeg","assets/js/vehicles/agile/agile12.jpeg","assets/js/vehicles/agile/agile14.jpeg","assets/js/vehicles/agile/agile15.jpeg"]',
 false),
('Chevrolet','Montana LS 1.4','picape',2012,326843,'Manual','Flex','Cinza',42900,
 'CHEVROLET MONTANA LS 1.4 2012, picape versátil, econômica e muito bem conservada. Equipada com motor 1.4, direção hidráulica, ar-condicionado, airbag duplo, alarme, travas elétricas, vidros elétricos, retrovisores manuais, som, sensor de ré e rodas aro 15. Veículo emplacado 2026, pronto para rodar, ideal para quem busca praticidade, economia e resistência tanto para o trabalho quanto para o uso diário.',
 '["Motor 1.4","Direção hidráulica","Ar-condicionado","Airbag duplo","Sensor de ré","Rodas aro 15","Emplacado 2026"]',
 '20%',
 '["assets/js/vehicles/montana/montana1.jpeg","assets/js/vehicles/montana/montana2.jpeg","assets/js/vehicles/montana/montana3.jpeg","assets/js/vehicles/montana/montana4.jpeg","assets/js/vehicles/montana/montana5.jpeg","assets/js/vehicles/montana/montana6.jpeg","assets/js/vehicles/montana/montana7.jpeg","assets/js/vehicles/montana/montana8.jpeg","assets/js/vehicles/montana/montana9.jpeg","assets/js/vehicles/montana/montana10.jpeg","assets/js/vehicles/montana/montana11.jpeg"]',
 false),
('Fiat','Strada Freedom 1.3 CD','picape',2024,57044,'Manual','Flex','Branco',98900,
 'FIAT STRADA FREEDOM 1.3 CD 2024, único dono, picape moderna, completa e em excelente estado de conservação. Equipada com motor 1.3, direção elétrica, airbag duplo, ar-condicionado, alarme com chave canivete, travas elétricas, vidros elétricos, retrovisores elétricos, som original, sensor de ré, computador de bordo e rodas aro 15. Veículo emplacado 2026, pronto para rodar, oferecendo conforto, tecnologia, economia e a versatilidade ideal para o trabalho e o uso diário.',
 '["Único dono","Motor 1.3","Direção elétrica","Airbag duplo","Sensor de ré","Computador de bordo","Rodas aro 15","Emplacado 2026"]',
 null,
 '["assets/js/vehicles/strada/strada1.jpeg","assets/js/vehicles/strada/strada2.jpeg","assets/js/vehicles/strada/strada3.jpeg","assets/js/vehicles/strada/strada4.jpeg","assets/js/vehicles/strada/strada5.jpeg","assets/js/vehicles/strada/strada6.jpeg","assets/js/vehicles/strada/strada7.jpeg","assets/js/vehicles/strada/strada8.jpeg","assets/js/vehicles/strada/strada9.jpeg","assets/js/vehicles/strada/strada10.jpeg","assets/js/vehicles/strada/strada11.jpeg","assets/js/vehicles/strada/strada12.jpeg"]',
 false)
on conflict do nothing;
