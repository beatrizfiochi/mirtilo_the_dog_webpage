# Mirtilo the Dog 🐾

---

## Tema escolhido

Webpage institucional e de catálogo para a marca **Mirtilo the Dog**, um projeto de joalharia artesanal que cria peças únicas em resina com pelo ou cinzas de animais de estimação.

---

## Tecnologias utilizadas

- **HTML5**
- **CSS3**
- **JavaScript (Vanilla JS)**
- **Bootstrap 5.3**
- **Bootstrap Icons 1.13**
- **Google Fonts**
- **JSON**
- **Formspree**

---

## Funcionalidades principais

- **Página inicial (Home)** — apresentação minimalista da marca com frase de identidade e links para redes sociais (Facebook e Instagram)
- **Sobre nós** — história da fundadora e da marca, com carrossel automático de imagens
- **Catálogo dinâmico** — produtos carregados a partir de um ficheiro JSON e renderizados em cards; suporta filtragem por categoria via URL (`?categoria=colares`, `conta`, `porta-chaves`, `personalizado`, `news`) e filtro de preço (mínimo/máximo)
- **Página de produto** — detalhe individual de cada produto com imagem, nome, coleção, descrição, material, tamanho, cor e preço; dados carregados dinamicamente por ID via URL
- **Formulário de pedido** — formulário completo com validação client-side (nome, email com regex, telefone, seleção múltipla de modelos, opções de envio/receção por correio ou em mãos, morada condicional); envio para Formspree com feedback visual de sucesso ou erro
- **Navegação responsiva** — menu em offcanvas com accordion para as subcategorias do catálogo; compatível com mobile e desktop

---

## Limitações conhecidas e ideias futuras

**Limitações atuais:**

- O catálogo é um ficheiro JSON estático — adicionar ou editar produtos requer edição manual do ficheiro
- Não existe sistema de carrinho de compras nem pagamento online integrado
- O formulário de pedido depende de um serviço externo (Formspree), sem painel de gestão próprio
- A página de produto (`produto.html`) não tem título dinâmico no `<title>` da tab ao carregar (apenas atualiza via JS após fetch)

**Ideias para desenvolvimento futuro:**

- Integração com um CMS ou painel de administração para gestão do catálogo
- Adição de um sistema de carrinho e checkout com pagamento (ex: Stripe ou MB Way)
- Galeria de trabalhos realizados / testemunhos de clientes
- Página de FAQ sobre o processo de produção e envio de amostras
- Versão multilíngue (português / inglês)
- Otimização SEO (meta descriptions, Open Graph, structured data)
- Animações de entrada nos cards do catálogo para melhorar a experiência visual

---

*© Mirtilo the Dog — Criada à mão para guardar um vínculo que não termina ∞*

---

Desenvolvido por [@beatrizfiochi](https://github.com/beatrizfiochi)

[Repositório](https://github.com/beatrizfiochi/mirtilo_the_dog_webpage)

[Github Pages](https://beatrizfiochi.github.io/mirtilo_the_dog_webpage/pages/index.html)