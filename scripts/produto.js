document.addEventListener("DOMContentLoaded", function () {

  const parametros = new URLSearchParams(window.location.search);
  const idProduto = parseInt(parametros.get("id"));

  if (!idProduto) {
    document.getElementById("info-produto").innerHTML =
      "<p>Produto não encontrado. <a href='catalogo.html'>Voltar ao catálogo</a></p>";
    return;
  }

  fetch("../assets/data/catalogo.json")
    .then(function (resposta) {
      return resposta.json();
    })
    .then(function (dados) {

      const produto = dados.catalogo_produtos.find(function (p) {
        return p.id === idProduto;
      });

      if (!produto) {
        document.getElementById("info-produto").innerHTML =
          "<p>Produto não encontrado. <a href='catalogo.html'>Voltar ao catálogo</a></p>";
        return;
      }

      document.title = produto.nome_produto + " — Mirtilo the Dog";

        document.getElementById("imagem-produto").innerHTML = `
        <img
            src="${produto.imagem_src}"
            alt="${produto.nome_produto}"
            class="produto-img"
        >
        <h1 class="mt-3 fw-bold">${produto.nome_produto}</h1>
        `;

        document.getElementById("info-produto").innerHTML = `
        <div class="text-center fs-5">

            ${produto.nome_colecao
            ? `<p>Coleção<br><span class="fw-bold">${produto.nome_colecao}</span></p>`
            : ""
            }

            ${produto.descricao
            ? `<p>Descrição<br><span class="fw-bold">${produto.descricao}</span></p>`
            : ""
            }

            ${produto.material
            ? `<p>Material<br><span class="fw-bold">${produto.material}</span></p>`
            : ""
            }

            ${produto.tamanho
            ? `<p>Tamanho<br><span class="fw-bold">${produto.tamanho}</span></p>`
            : ""
            }

            ${produto.cor
            ? `<p>Cor<br><span class="fw-bold">${produto.cor}</span></p>`
            : ""
            }

            <p class="fw-bold fs-4 mt-3">
            ${produto.preco > 0
                ? produto.preco.toFixed(2) + " €"
                : "Preço sob consulta"
            }
            </p>

            <div class="produto-acoes mt-3">
            <a href="#" id="btn-voltar" class="btn">← Voltar</a>
            </div>

        </div>
        `;

        document.getElementById("btn-voltar").addEventListener("click", function (e) {
          e.preventDefault();
          if (document.referrer) {
            history.back();
          } else {
            window.location.href = "catalogo.html";
          }
        });
    })
    .catch(function (erro) {
      console.error("Erro ao carregar o produto:", erro);
      document.getElementById("info-produto").innerHTML =
        "<p>Erro ao carregar o produto. Tenta novamente mais tarde.</p>";
    });
});