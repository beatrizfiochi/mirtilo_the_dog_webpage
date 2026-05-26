document.addEventListener("DOMContentLoaded", function () {

    const parametros = new URLSearchParams(window.location.search);
    const idProduto = parseInt(parametros.get("id"));

    const erro = "<p>Produto não encontrado. <a href='catalogo.html'>Voltar ao catálogo</a></p>";

    if (!idProduto) {
        document.getElementById("produto-nome").innerHTML = erro;
        return;
    }

    fetch("../assets/data/catalogo.json")
        .then(r => r.json())
        .then(function (dados) {

            const produto = dados.catalogo_produtos.find(p => p.id === idProduto);

            if (!produto) {
                document.getElementById("produto-nome").innerHTML = erro;
                return;
            }

            // Título da aba e header
            document.title = produto.nome_produto + " — Mirtilo the Dog";
            document.getElementById("produto-nome").textContent = produto.nome_produto;

            // Campos opcionais — esconde o bloco se não existir
            if (produto.descricao) {
                document.getElementById("produto-descricao").textContent = produto.descricao;
            } else {
                document.getElementById("produto-descricao").style.display = "none";
            }

            if (produto.nome_colecao) {
                document.getElementById("produto-colecao").textContent = produto.nome_colecao;
            } else {
                document.getElementById("bloco-colecao").style.display = "none";
            }

            if (produto.material) {
                document.getElementById("produto-material").textContent = produto.material;
            } else {
                document.getElementById("bloco-material").style.display = "none";
            }

            if (produto.cor) {
                document.getElementById("produto-cor").textContent = produto.cor;
            } else {
                document.getElementById("bloco-cor").style.display = "none";
            }

            // Preço
            document.getElementById("produto-preco").textContent = produto.preco > 0
                ? produto.preco.toFixed(2) + " €"
                : "Preço sob consulta";

            // Imagem
            const img = document.getElementById("produto-imagem");
            img.src = produto.imagem_src;
            img.alt = produto.nome_produto;

            // Botão voltar
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
            document.getElementById("produto-nome").innerHTML =
                "<p>Erro ao carregar o produto. Tenta novamente mais tarde.</p>";
        });
});