document.addEventListener("DOMContentLoaded", function () {

  const parametros = new URLSearchParams(window.location.search);
  const categoriaEscolhida = parametros.get("categoria") || "todos";

  // Guarda os produtos da categoria atual para o filtro de preço poder usá-los
  let produtosDaCategoria = [];

  function renderizarCards(lista) {
    const divProdutos = document.getElementById("produtos");

    if (lista.length === 0) {
      divProdutos.innerHTML = `<p class="text-center mt-4" style="color: var(--cinza)">Nenhum produto encontrado neste intervalo de preço.</p>`;
      return;
    }

    divProdutos.innerHTML = ""; // limpa antes de redesenhar

    lista.forEach(function (produto) {
      const coluna = document.createElement("div");
      coluna.className = "col-12 col-md-6 col-lg-4 mb-2";

      coluna.innerHTML = `
        <div class="card h-100">
          <img src="${produto.imagem_src}" class="card-img-top" alt="${produto.nome_produto}">
          <div class="card-body">
            <h5 class="card-title">${produto.nome_produto}</h5>
            ${produto.preco > 0
              ? `<p class="card-text fw-bold">${produto.preco.toFixed(2)} €</p>`
              : `<p class="card-text fw-bold">Preço sob consulta</p>`
            }
            <a class="btn btn-catalogo" href="produto.html?id=${produto.id}" role="button">Ver mais</a>
          </div>
        </div>
      `;

      divProdutos.appendChild(coluna);
    });
  }

  fetch("../assets/data/catalogo.json")
    .then(function (resposta) {
      return resposta.json();
    })
    .then(function (dados) {

      const todosProdutos = dados.catalogo_produtos;

      if (categoriaEscolhida === "todos") {
        produtosDaCategoria = todosProdutos;
      } else {
        produtosDaCategoria = todosProdutos.filter(function (produto) {
          return produto.categoria === categoriaEscolhida;
        });
      }

      const temPrecosReais = produtosDaCategoria.some(p => p.preco > 0);
      if (temPrecosReais) {
        document.getElementById("filtro-preco").style.display = "flex";
      }

      renderizarCards(produtosDaCategoria);
    })
    .catch(function (erro) {
      console.error("Erro ao carregar o catálogo:", erro);
      document.getElementById("produtos").innerHTML =
        "<p>Erro ao carregar os produtos. Tenta novamente mais tarde.</p>";
    });

  window.aplicarFiltroPreco = function () {
    const min = parseFloat(document.getElementById("precoMin").value) || 0;
    const max = parseFloat(document.getElementById("precoMax").value) || Infinity;

    const filtrados = produtosDaCategoria.filter(function (produto) {
      // Produtos sem preço passam
      if (produto.preco === 0) {
        return true;
      }
      return produto.preco >= min && produto.preco <= max;
    });

    renderizarCards(filtrados);
  };

  // Limpar filtro
  window.limparFiltroPreco = function () {
    document.getElementById("precoMin").value = "";
    document.getElementById("precoMax").value = "";
    renderizarCards(produtosDaCategoria);
  };

});