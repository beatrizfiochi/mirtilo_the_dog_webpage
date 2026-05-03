// ── Carrega modelos do catálogo ──
async function carregarModelos() {
    try {
        const response = await fetch('../data/catalogo.json');
        const dados = await response.json();
        const select = document.getElementById('modelos-select');

        // Filtra apenas produtos que não são "news"
        const produtosDisponiveis = dados.catalogo_produtos.filter(
            p => p.categoria !== 'news'
        );

        produtosDisponiveis.forEach(produto => {
            const option = document.createElement('option');
            option.value = produto.id;
            option.textContent = produto.nome_produto;
            select.appendChild(option);
        });
    } catch (erro) {
        // Fallback: preenche com os dados do JSON fornecido
        const modelosFallback = [
            { id: 1, nome: 'Colar Flor' },
            { id: 2, nome: 'Colar Céu' },
            { id: 3, nome: 'Colar Sol' },
            { id: 4, nome: 'Colar Jasmim' },
            { id: 5, nome: 'Conta Mimo' },
            { id: 6, nome: 'Colar Mimo' },
            { id: 7, nome: 'Porta-chaves Luna' },
            { id: 8, nome: 'Personalizado' },
        ];
        const select = document.getElementById('modelos-select');
        modelosFallback.forEach(m => {
            const option = document.createElement('option');
            option.value = m.id;
            option.textContent = m.nome;
            select.appendChild(option);
        });
    }
}

carregarModelos();

// ── Mostra/oculta campo morada consoante a opção de envio ──
function configurarMorada(grupoId, campoId, inputId) {
const radios = document.querySelectorAll(`input[name="${grupoId}"]`);
const campo = document.getElementById(campoId);
const input = document.getElementById(inputId);

radios.forEach(radio => {
    radio.addEventListener('change', () => {
        if (radio.value === 'correio' && radio.checked) {
            campo.classList.add('visivel');
            input.required = true;
        } else if (radio.value === 'maos' && radio.checked) {
            campo.classList.remove('visivel');
            input.required = false;
            input.value = '';
            input.classList.remove('is-invalid');
        }
    });
});
}

configurarMorada('recepcao-peca', 'campo-morada-recepcao', 'morada-recepcao');

// ── Validação e submit ──
document.getElementById('formulario-pedido').addEventListener('submit', function (e) {
e.preventDefault();

let valido = true;

// Validação dos campos normais
const camposObrigatorios = ['nome', 'email', 'telefone'];
camposObrigatorios.forEach(id => {
    const campo = document.getElementById(id);
    if (!campo.value.trim()) {
        campo.classList.add('is-invalid');
        valido = false;
    } else {
        campo.classList.remove('is-invalid');
    }
});

// Validação email
const email = document.getElementById('email');
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (email.value && !regexEmail.test(email.value)) {
    email.classList.add('is-invalid');
    valido = false;
}

// Validação telefone (apenas números, mínimo 9 dígitos)
const telefone = document.getElementById('telefone');
const regexTelefone = /^\d{9,}$/;
if (telefone.value && !regexTelefone.test(telefone.value)) {
    telefone.classList.add('is-invalid');
    valido = false;
}

// Validação multiselect
const select = document.getElementById('modelos-select');
if (select.selectedOptions.length === 0) {
    select.classList.add('is-invalid');
    valido = false;
} else {
    select.classList.remove('is-invalid');
}

// Validação radio envio amostra
const envioSelecionado = document.querySelector('input[name="envio-amostra"]:checked');
const validacaoEnvio = document.getElementById('validacao-envio');
if (!envioSelecionado) {
    validacaoEnvio.style.display = 'block';
    valido = false;
} else {
    validacaoEnvio.style.display = 'none';
}

// Validação radio receção peça
const recepcaoSelecionado = document.querySelector('input[name="recepcao-peca"]:checked');
const validacaoRecepcao = document.getElementById('validacao-recepcao');
if (!recepcaoSelecionado) {
    validacaoRecepcao.style.display = 'block';
    valido = false;
} else {
    validacaoRecepcao.style.display = 'none';
}

// Validação morada de receção (se correio selecionado)
if (recepcaoSelecionado && recepcaoSelecionado.value === 'correio') {
    const moradaRecepcao = document.getElementById('morada-recepcao');
    if (!moradaRecepcao.value.trim()) {
        moradaRecepcao.classList.add('is-invalid');
        valido = false;
    } else {
        moradaRecepcao.classList.remove('is-invalid');
    }
}

if (valido) {
    document.getElementById('formulario-pedido').style.display = 'none';
    document.getElementById('mensagem-sucesso').style.display = 'block';
}
});

// Remove is-invalid ao começar a editar
document.querySelectorAll('.form-control, .form-select').forEach(el => {
el.addEventListener('input', () => el.classList.remove('is-invalid'));
});