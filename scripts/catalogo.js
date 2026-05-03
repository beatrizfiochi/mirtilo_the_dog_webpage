// DOMContentLoaded espera a página carregar por completo

document.addEventListener("DOMContentLoaded", function () {

  // URLSearchParams descobre qual categoria foi clicada (lê os parâmetros da URL)
  // exemplo:
  //   catalogo.html?categoria=colar  → categoria = "colar"

  const parametros = new URLSearchParams(window.location.search);
  const categoriaEscolhida = parametros.get("categoria") || "todos";

  // fetch() busca o ficheiro JSON com os produtos
  // O caminho é relativo à localização do ficheiro HTML

  fetch("../assets/data/catalogo.json")
    .then(function (resposta) {
      return resposta.json();
    })
    .then(function (dados) {

      const todosProdutos = dados.catalogo_produtos;

      let produtosFiltrados;

      if (categoriaEscolhida === "todos") {
        produtosFiltrados = todosProdutos;
      } else {
        produtosFiltrados = todosProdutos.filter(function (produto) {
          return produto.categoria === categoriaEscolhida;
        });
      }

      // Criar os cards e colocá-los na página

      const divProdutos = document.getElementById("produtos");

      if (produtosFiltrados.length === 0) {
        divProdutos.innerHTML = "<p>Nenhum produto encontrado nesta categoria.</p>";
        return;
      }

      produtosFiltrados.forEach(function (produto) {
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
    })
    .catch(function (erro) {
      // .catch() corre se houver algum erro (ex: ficheiro não encontrado)
      console.error("Erro ao carregar o catálogo:", erro);
      document.getElementById("produtos").innerHTML =
        "<p>Erro ao carregar os produtos. Tenta novamente mais tarde.</p>";
    });
});