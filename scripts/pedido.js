// ── Carrega modelos do catálogo ──
async function carregarModelos() {
    try {
        const response = await fetch('../data/catalogo.json');
        const dados = await response.json();
        const select = document.getElementById('modelos-select');

        dados.catalogo_produtos
            .filter(p => p.categoria !== 'news')
            .forEach(produto => {
                const option = document.createElement('option');
                option.value = produto.nome_produto; // nome em vez de id, para o email ser legível
                option.textContent = produto.nome_produto;
                select.appendChild(option);
            });
    } catch (erro) {
        const modelosFallback = [
            { nome: 'Colar Flor' },
            { nome: 'Colar Céu' },
            { nome: 'Colar Sol' },
            { nome: 'Colar Jasmim' },
            { nome: 'Conta Mimo' },
            { nome: 'Colar Mimo' },
            { nome: 'Porta-chaves Luna' },
            { nome: 'Personalizado' },
        ];
        const select = document.getElementById('modelos-select');
        modelosFallback.forEach(m => {
            const option = document.createElement('option');
            option.value = m.nome;
            option.textContent = m.nome;
            select.appendChild(option);
        });
    }
}

carregarModelos();

// ── Mostra/oculta campo morada consoante a opção de receção ──
function configurarMorada(grupoId, campoId, inputId) {
    const radios = document.querySelectorAll(`input[name="${grupoId}"]`);
    const campo = document.getElementById(campoId);
    const input = document.getElementById(inputId);

    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'correio' && radio.checked) {
                campo.style.display = 'block';
                input.required = true;
            } else if (radio.value === 'maos' && radio.checked) {
                campo.style.display = 'none';
                input.required = false;
                input.value = '';
                input.classList.remove('is-invalid');
            }
        });
    });
}

configurarMorada('recepcao-peca', 'campo-morada-recepcao', 'morada-recepcao');

// ── Validação e submit com Formspree ──
document.getElementById('formulario-pedido').addEventListener('submit', async function (e) {
    e.preventDefault();

    let valido = true;

    // Campos de texto obrigatórios
    ['nome', 'email', 'telefone'].forEach(id => {
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
    if (telefone.value && !regexTelefone.test(telefone.value.replace(/\s/g, ''))) {
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

    if (!valido) return;

    // ── Tudo válido: envia para o Formspree ──
    const modelos = Array.from(select.selectedOptions).map(o => o.value).join(', ');
    const moradaRecepcao = document.getElementById('morada-recepcao');

    const dados = {
        Nome:               document.getElementById('nome').value,
        Email:              email.value,
        Telefone:           telefone.value,
        Modelos:            modelos,
        'Envio da amostra': envioSelecionado.value === 'correio' ? 'Pelo correio' : 'Em mãos (Porto)',
        'Receção da peça':  recepcaoSelecionado.value === 'correio' ? 'Pelo correio' : 'Em mãos (Porto)',
        'Morada de entrega': recepcaoSelecionado.value === 'correio' ? moradaRecepcao.value : 'Em mãos (Porto)',
        Mensagem:           document.getElementById('mensagem').value || '(sem mensagem)',
    };

    // Feedback visual no botão
    const btn = document.querySelector('.btn-pedido');
    btn.disabled = true;
    btn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>A enviar...';

    try {
        const resposta = await fetch('https://formspree.io/f/xeenaoel', { // ← substitui pelo teu ID do Formspree
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (resposta.ok) {
            document.getElementById('formulario-pedido').style.display = 'none';
            document.getElementById('mensagem-sucesso').style.display = 'block';
        } else {
            throw new Error('Resposta não ok');
        }
    } catch (erro) {
        btn.disabled = false;
        btn.innerHTML = '<i class="bi bi-send me-2"></i>Enviar pedido';
        alert('Ocorreu um erro ao enviar o pedido. Por favor tenta novamente ou contacta-nos diretamente.');
    }
});

// Remove is-invalid ao começar a editar
document.querySelectorAll('.form-control, .form-select').forEach(el => {
    el.addEventListener('input', () => el.classList.remove('is-invalid'));
});