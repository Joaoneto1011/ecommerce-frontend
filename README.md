# 🍔 Point da Chama

**Lanches no ponto certo.** Loja completa de lanchonete, consumindo a [API Spring Boot](../ecommerce) do projeto. Vitrine pública (cardápio, carrinho, checkout simulado, pedidos) **e** painel administrativo para o dono/funcionário gerenciar produtos, categorias e pedidos.

> Este é um projeto **separado** do frontend feito durante o curso (`../ecommerce-frontend`) — construído do zero, com stack e decisões de arquitetura próprias, pensado como peça de portfólio.

## 🚀 Rodando localmente

Pré-requisitos: backend rodando em `http://localhost:8080` (veja `../ecommerce/README.md`).

```bash
npm install
npm run dev
```

Abre em `http://localhost:5174` (porta fixa, para rodar em paralelo com o frontend do curso na 5173).

Login de administrador padrão (seed do backend): `administrador` / `senhaAdministrador` → acessa `/admin`.

## 🧱 Stack

- **React 19 + Vite**
- **Redux Toolkit + RTK Query** — cache e invalidação automática por tags, sem thunk/reducer manual
- **React Router v7** — rotas protegidas via `RotaProtegida` (cliente autenticado) e `RotaAdmin` (perfil administrador)
- **React Hook Form + Zod** — validação de formulário espelhando as constraints do backend
- **Tailwind CSS v4 + Headless UI** — design system próprio (sem biblioteca de componentes pronta)
- **react-hot-toast** — feedback de ações

## 🔐 Autenticação

Token JWT via header `Authorization: Bearer`, guardado em `localStorage` (não cookie httpOnly, apesar do backend suportar) — decisão deliberada porque este frontend é hospedado em domínio diferente do backend em produção, e cookie cross-site exige configuração adicional (`SameSite=None; Secure`) que não compensa a complexidade para um projeto de portfólio. Ver `src/app/baseQuery.js`.

## 💳 Pagamento

O checkout é **simulado** — não existe integração real com gateway de pagamento (nem no frontend, nem no backend). Isso é mostrado com um aviso visível na tela de pagamento. O pedido é sempre criado com status `PENDENTE` pelo backend, independente do que for enviado como "resposta do gateway".

## 🛠️ Painel administrativo (`/admin`)

Acesso restrito a usuários com perfil `PERFIL_ADMINISTRADOR` (guarda de rota `RotaAdmin`), com layout próprio (sidebar), separado visualmente da vitrine do cliente:

- **Dashboard** — visão geral (produtos, categorias, pedidos pendentes, receita)
- **Produtos** — listar, criar, editar, excluir, upload de imagem
- **Categorias** — listar, criar, editar, excluir
- **Pedidos** — listar todos os pedidos de todos os clientes, avançar status (Pendente → Pago → Enviado → Entregue, ou Cancelado)

## 📂 Estrutura

```
src/
  app/            store, base query (RTK Query + tratamento de 401)
  api/            slices de API por recurso (produtos, categorias, carrinho, endereços, pedidos, autenticação)
  features/
    auth/         login, cadastro, RotaProtegida
    admin/        RotaAdmin, layout próprio, dashboard, produtos, categorias, pedidos (gestão)
    catalogo/, carrinho/, enderecos/, checkout/, pedidos/   → páginas da vitrine do cliente
  components/     UI kit (Button, Input, Select, Card, Badge, Modal, Spinner, Skeleton) + layout do cliente (Header, Footer)
  lib/            formatação (moeda, data) e schemas de validação (zod)
  routes/         definição de rotas
```

## ⚠️ Fora de escopo

- Carrinho para visitante não autenticado — o backend não tem esse conceito; adicionar ao carrinho deslogado redireciona para o login.
- Gerenciamento de categorias hoje é liberado para qualquer usuário autenticado no backend (não só admin) — o painel restringe pela UI, mas a API em si ainda não tem essa restrição.
