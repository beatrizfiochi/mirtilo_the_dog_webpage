document.addEventListener("DOMContentLoaded", function () {

  const parametros = new URLSearchParams(window.location.search);
  const categoriaEscolhida = parametros.get("categoria") || "todos";

  const precoMinURL = parametros.get("precoMin");
  const precoMaxURL = parametros.get("precoMax");

  let produtosDaCategoria = [];

  function renderizarCards(lista) {
    const divProdutos = document.getElementById("produtos");

    if (lista.length === 0) {
      divProdutos.innerHTML = `
        <p class="text-center mt-4" style="color: var(--cinza)">
          Nenhum produto encontrado neste intervalo de preço.
        </p>`;
      return;
    }

    divProdutos.innerHTML = "";

    lista.forEach(function (produto, index) {
      const delays = ["0.1s", "0.3s", "0.5s"];
      const delay = delays[index % 3];

      const coluna = document.createElement("div");
      coluna.className = "col-lg-4 col-md-6 wow fadeInUp";
      coluna.setAttribute("data-wow-delay", delay);

      coluna.innerHTML = `
        <div class="product-item d-flex flex-column bg-white rounded overflow-hidden h-100">
          <div class="text-center p-4">
            ${produto.preco > 0
              ? `<div class="d-inline-block border border-primary rounded-pill px-3 mb-3">
                    ${produto.preco.toFixed(2)} €
                 </div>`
              : `<div class="d-inline-block border border-primary rounded-pill px-3 mb-3">
                    Preço sob consulta
                 </div>`
            }
            <h3 class="mb-3">${produto.nome_produto}</h3>
          </div>
          <div class="product-img-wrapper mt-auto">
            <img src="${produto.imagem_src}" alt="${produto.nome_produto}">
            <div class="product-overlay">
              <a class="btn btn-lg-square btn-outline-light rounded-circle"
                href="produto.html?id=${produto.id}">
                <i class="fa fa-eye"></i>
              </a>
            </div>
          </div>
        </div>
      `;

      divProdutos.appendChild(coluna);
    });

    if (typeof WOW !== "undefined") {
      new WOW().init();
    }
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

      if (precoMinURL || precoMaxURL) {
        if (precoMinURL) document.getElementById("precoMin").value = precoMinURL;
        if (precoMaxURL) document.getElementById("precoMax").value = precoMaxURL;

        const min = parseFloat(precoMinURL) || 0;
        const max = parseFloat(precoMaxURL) || Infinity;

        const filtrados = produtosDaCategoria.filter(function (produto) {
          if (produto.preco === 0) return true;
          return produto.preco >= min && produto.preco <= max;
        });

        renderizarCards(filtrados);
      } else {
        renderizarCards(produtosDaCategoria);
      }

      // ── Botões de categoria ──
      document.querySelectorAll(".btn-categoria").forEach(btn => {
        if (btn.dataset.categoria === categoriaEscolhida) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }

        btn.addEventListener("click", function () {
          document.querySelectorAll(".btn-categoria").forEach(b => b.classList.remove("active"));
          this.classList.add("active");

          document.getElementById("precoMin").value = "";
          document.getElementById("precoMax").value = "";

          const cat = this.dataset.categoria;
          produtosDaCategoria = cat === "todos"
            ? todosProdutos
            : todosProdutos.filter(p => p.categoria === cat);

          const params = new URLSearchParams(window.location.search);
          params.set("categoria", cat);
          params.delete("precoMin");
          params.delete("precoMax");
          history.replaceState(null, "", "?" + params.toString());

          const temPrecos = produtosDaCategoria.some(p => p.preco > 0);
          document.getElementById("filtro-preco").style.display = temPrecos ? "flex" : "none";

          renderizarCards(produtosDaCategoria);
        });
      });

    })
    .catch(function (erro) {
      console.error("Erro ao carregar o catálogo:", erro);
      document.getElementById("produtos").innerHTML =
        "<p>Erro ao carregar os produtos. Tenta novamente mais tarde.</p>";
    });

  window.aplicarFiltroPreco = function () {
    const min = parseFloat(document.getElementById("precoMin").value) || 0;
    const max = parseFloat(document.getElementById("precoMax").value) || Infinity;

    const params = new URLSearchParams(window.location.search);
    if (document.getElementById("precoMin").value) {
      params.set("precoMin", document.getElementById("precoMin").value);
    } else {
      params.delete("precoMin");
    }
    if (document.getElementById("precoMax").value) {
      params.set("precoMax", document.getElementById("precoMax").value);
    } else {
      params.delete("precoMax");
    }
    history.replaceState(null, "", "?" + params.toString());

    const filtrados = produtosDaCategoria.filter(function (produto) {
      if (produto.preco === 0) return true;
      return produto.preco >= min && produto.preco <= max;
    });

    renderizarCards(filtrados);
  };

  window.limparFiltroPreco = function () {
    document.getElementById("precoMin").value = "";
    document.getElementById("precoMax").value = "";

    const params = new URLSearchParams(window.location.search);
    params.delete("precoMin");
    params.delete("precoMax");
    const novoURL = params.toString() ? "?" + params.toString() : window.location.pathname;
    history.replaceState(null, "", novoURL);

    renderizarCards(produtosDaCategoria);
  };

});