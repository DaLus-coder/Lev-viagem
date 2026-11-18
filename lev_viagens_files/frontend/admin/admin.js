
/* =========================================================
   AUTENTICAÇÃO ADMINISTRATIVA
========================================================= */

// Verifica se o administrador está autenticado.
// Caso contrário, redireciona para a tela de login.
if (localStorage.getItem("adminLogado") !== "true") {
    window.location.href = "login.html";
}


/* =========================================================
   CONFIGURAÇÃO BASE DA API E VARIÁVEIS GLOBAIS
========================================================= */

// Endereço base da API hospedada no Render.
const API = "https://lev-viagem.onrender.com/api";

// Armazena o ID do card atualmente em edição.
// null indica que um novo card será criado.
let editId = null;

// Armazena o ID do cliente atualmente em edição.
let clienteEditId = null;


/* =========================================================
   SIDEBAR MOBILE (ABRIR / FECHAR MENU)
========================================================= */

// Seleciona os elementos responsáveis pelo menu lateral.
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const menuToggle = document.getElementById("menuToggle");

// Abre ou fecha a sidebar ao clicar no botão do menu.
menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
});

// Fecha a sidebar ao clicar na área externa (overlay).
overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
});


/* =========================================================
   CARREGAMENTO DOS CARDS (READ / LISTAGEM)
========================================================= */

async function load() {

    // Exibe o indicador de carregamento.
    showLoading();

    try {

        // Solicita todos os cards cadastrados na API.
        const res = await fetch(API + "/cards");
        const cards = await res.json();

        // Seleciona as listas correspondentes às categorias.
        const alugueis = document.getElementById("listaAlugueis");
        const experiencias = document.getElementById("listaExperiencias");
        const gastronomia = document.getElementById("listaGastronomia");

        // Limpa as listas antes de inserir os cards atualizados.
        alugueis.innerHTML = "";
        experiencias.innerHTML = "";
        gastronomia.innerHTML = "";

        // Percorre todos os cards retornados pela API.
        cards.forEach(card => {

            // Estrutura HTML individual de cada card administrativo.
            const html = `
                <div class="card-admin">

                    <img src="${card.imagem}">

                    <h4>${card.titulo}</h4>

                    <div class="card-actions">

                        <button class="edit-btn"
                        onclick="edit(${card.id})">
                            Editar
                        </button>

                        <button class="delete-btn"
                        onclick="remove(${card.id})">
                            Excluir
                        </button>

                    </div>

                </div>
            `;

            // Direciona o card para sua respectiva categoria.
            if (card.categoria === "alugueis") {
                alugueis.innerHTML += html;
            }

            if (card.categoria === "experiencias") {
                experiencias.innerHTML += html;
            }

            if (card.categoria === "gastronomia") {
                gastronomia.innerHTML += html;
            }

        });

    } finally {

        // Oculta o indicador de carregamento,
        // mesmo quando ocorre algum erro na operação.
        hideLoading();

    }

}


/* =========================================================
   SALVAR / CRIAR OU ATUALIZAR CARD (CREATE / UPDATE)
========================================================= */

async function saveCard() {

    // Seleciona o botão de salvar para controlar seu estado.
    const btnSalvar = document.getElementById("btnSalvar");

    // Impede novos cliques enquanto o salvamento acontece.
    btnSalvar.disabled = true;
    btnSalvar.innerText = "Salvando...";

    // Captura os valores preenchidos no formulário.
    const titulo = document.getElementById("titulo").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const imagem = document.getElementById("imagem").value.trim();
    const categoria = document.getElementById("categoria").value;
    const botao_texto = document.getElementById("botao_texto").value.trim();

    // Verifica se todos os campos obrigatórios foram preenchidos.
    if (!titulo || !descricao || !imagem || !categoria || !botao_texto) {

        alert("Preencha todos os campos!");

        // Reativa o botão e restaura seu texto.
        btnSalvar.disabled = false;
        btnSalvar.innerText = "Salvar";

        return;
    }

    // Solicita confirmação antes de enviar os dados.
    if (!confirm("Tem certeza?")) {

        btnSalvar.disabled = false;
        btnSalvar.innerText = "Salvar";

        return;

    }

    // Organiza os dados que serão enviados ao backend.
    const data = {
        titulo,
        descricao,
        imagem,
        categoria,
        botao_texto
    };

    // Define a rota conforme a operação:
    // PUT atualiza um card existente.
    // POST cria um novo card.
    const url = editId
        ? `${API}/admin/cards/${editId}`
        : `${API}/admin/cards`;

    const method = editId ? "PUT" : "POST";

    // Exibe o indicador de carregamento.
    showLoading();

    try {

        // Envia os dados para a API.
        await fetch(url, {

            method,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        });

        // Finaliza o estado de edição.
        editId = null;

        // Limpa os campos do formulário.
        clear();

        // Atualiza a listagem dos cards.
        await load();

    } finally {

        // Restaura o botão após a operação.
        btnSalvar.disabled = false;
        btnSalvar.innerText = "Salvar";

        // Oculta o indicador de carregamento.
        hideLoading();

    }

}


/* =========================================================
   EDITAR CARD (LOAD DADOS NO FORMULÁRIO)
========================================================= */

async function edit(id) {

    // Busca todos os cards cadastrados na API.
    const res = await fetch(API + "/cards");
    const cards = await res.json();

    // Localiza o card correspondente ao ID recebido.
    const c = cards.find(x => Number(x.id) === Number(id));

    // Interrompe a operação caso o card não seja encontrado.
    if (!c) {

        console.error("Card não encontrado. ID recebido:", id);
        console.log(cards);

        return;
    }

    // Armazena o ID do card que está sendo editado.
    editId = id;

    // Preenche os campos do formulário com os dados existentes.
    document.getElementById("titulo").value = c.titulo;
    document.getElementById("descricao").value = c.descricao;
    document.getElementById("imagem").value = c.imagem;
    document.getElementById("categoria").value = c.categoria;
    document.getElementById("botao_texto").value = c.botao_texto;

}


/* =========================================================
   EXCLUIR CARD (DELETE)
========================================================= */

async function remove(id) {

    // Exibe o indicador de carregamento.
    showLoading();

    try {

        // Solicita a exclusão do card pelo ID.
        await fetch(API + "/admin/cards/" + id, {

            method: "DELETE"

        });

        // Atualiza as listas após a exclusão.
        await load();

    } finally {

        // Oculta o indicador de carregamento.
        hideLoading();

    }

}


/* =========================================================
   LIMPAR FORMULÁRIO
========================================================= */

function clear() {

    // Limpa os campos utilizados no cadastro e edição de cards.
    document.getElementById("titulo").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("imagem").value = "";
    document.getElementById("botao_texto").value = "";

}


/* =========================================================
   UPLOAD DE IMAGEM (ENVIO PARA BACKEND)
========================================================= */

async function uploadImagem() {

    // Exibe o indicador de carregamento.
    showLoading();

    // Seleciona o campo de arquivo e o campo que receberá a URL.
    const fileInput = document.getElementById("file");
    const imagemInput = document.getElementById("imagem");

    // Verifica se o usuário selecionou algum arquivo.
    if (!fileInput.files.length) {

        alert("Selecione uma imagem primeiro!");

        hideLoading();

        return;

    }

    // Cria o objeto que transportará o arquivo.
    const formData = new FormData();

    // Adiciona a imagem com o nome esperado pelo backend.
    formData.append(
        "imagem",
        fileInput.files[0]
    );

    try {

        // Envia a imagem para a rota de upload da API.
        const res = await fetch(
            `${API}/upload`,
            {

                method: "POST",

                body: formData

            }
        );

        // Converte a resposta da API para JSON.
        const data = await res.json();

        // Verifica se a API retornou a URL da imagem.
        if (!data.url) {

            alert("Erro no upload");

            return;

        }

        // Insere a URL retornada no campo de imagem.
        document.getElementById("imagem").value = data.url;

        // Informa que o upload foi concluído.
        alert("Upload concluído!");

    } catch (err) {

        // Registra o erro no console para diagnóstico.
        console.error(err);

        alert("Erro ao enviar imagem");

    } finally {

        // Oculta o indicador de carregamento.
        hideLoading();

    }

}


/* =========================================================
   INICIALIZAÇÃO DO SISTEMA
========================================================= */

// Carrega os cards automaticamente ao abrir o painel.
load();


/* =========================================================
   LOGOUT ADMINISTRATIVO
========================================================= */

function logoutAdmin() {

    // Remove a identificação de administrador autenticado.
    localStorage.removeItem("adminLogado");

    // Redireciona para a página de login.
    window.location.href = "login.html";

}


/* =========================================================
   GERENCIAMENTO DE CLIENTES (READ / LISTAGEM)
========================================================= */

async function carregarClientes() {

    // Solicita a lista de clientes cadastrados.
    const res = await fetch(
        `${API}/admin/clientes`
    );

    const clientes = await res.json();

    // Seleciona a tabela onde os clientes serão exibidos.
    const tabela = document.getElementById("listaClientes");

    // Limpa o conteúdo anterior da tabela.
    tabela.innerHTML = "";

    // Percorre os clientes recebidos da API.
    clientes.forEach(cliente => {

        // Cria uma linha com os dados de cada cliente.
        tabela.innerHTML += `
            <tr>

                <td>${cliente.id}</td>

                <td>${cliente.nome}</td>

                <td>${cliente.email}</td>

                <td>${cliente.cidade || "-"}</td>

                <td>${cliente.telefone || "-"}</td>

                <td>

                    <button
                    class="edit-btn"
                    onclick="editarCliente(${cliente.id})">
                        Editar
                    </button>

                    <button
                    class="delete-btn"
                    onclick="excluirCliente(${cliente.id})">
                        Excluir
                    </button>

                </td>

            </tr>
        `;

    });

}


/* =========================================================
   NAVEGAÇÃO ENTRE SEÇÕES DO PAINEL
========================================================= */

function mostrarSecao(secao) {

    // Seleciona a seção de gerenciamento de cards.
    const secaoCards = document.getElementById("secaoCards");

    // Seleciona a seção de gerenciamento de clientes.
    const clientes = document.getElementById("clientes");

    // Seleciona os botões de navegação.
    const botoes = document.querySelectorAll(".nav-item");

    // Remove a indicação de seleção de todos os botões.
    botoes.forEach(botao => {
        botao.classList.remove("active");
    });

    // Verifica se o usuário deseja acessar os clientes.
    if (secao === "clientes") {

        // Esconde os cards e exibe os clientes.
        secaoCards.style.display = "none";
        clientes.style.display = "block";

        // Ativa o botão correspondente à seção de clientes.
        botoes[1].classList.add("active");

        // Atualiza a listagem de clientes.
        carregarClientes();

    } else {

        // Exibe os cards e esconde os clientes.
        secaoCards.style.display = "block";
        clientes.style.display = "none";

        // Ativa o botão correspondente aos cards.
        botoes[0].classList.add("active");

    }

}


/* =========================================================
   EDITAR CLIENTE (LOAD DADOS NO FORMULÁRIO)
========================================================= */

async function editarCliente(id) {

    // Busca os clientes cadastrados na API.
    const res = await fetch(
        `${API}/admin/clientes`
    );

    // Registra o ID recebido para diagnóstico.
    console.log("ID recebido:", id);

    const clientes = await res.json();

    // Informações auxiliares para verificar os dados retornados.
    console.log(clientes);
    console.log(typeof id);
    console.log(typeof clientes[0]?.id);

    // Localiza o cliente correspondente ao ID recebido.
    const cliente = clientes.find(
        c => Number(c.id) === Number(id)
    );

    // Interrompe a edição caso o cliente não seja encontrado.
    if (!cliente) {

        console.log("ID recebido:", id);
        console.log("Clientes:", clientes);

        alert("Cliente não encontrado.");

        return;
    }

    // Armazena o ID do cliente em edição.
    clienteEditId = id;

    // Preenche o formulário com os dados do cliente.
    document.getElementById("clienteNome").value =
        cliente.nome;

    document.getElementById("clienteEmail").value =
        cliente.email;

    document.getElementById("clienteCidade").value =
        cliente.cidade || "";

    document.getElementById("clienteTelefone").value =
        cliente.telefone || "";

}


/* =========================================================
   SALVAR CLIENTE (UPDATE)
========================================================= */

async function salvarCliente() {

    // Verifica se existe um cliente selecionado para edição.
    if (!clienteEditId) {

        alert("Selecione um cliente primeiro");

        return;

    }

    // Captura os dados preenchidos no formulário.
    const dados = {

        nome:
            document.getElementById("clienteNome").value,

        email:
            document.getElementById("clienteEmail").value,

        cidade:
            document.getElementById("clienteCidade").value,

        telefone:
            document.getElementById("clienteTelefone").value

    };

    // Envia os dados atualizados para a API.
    await fetch(
        `${API}/admin/clientes/${clienteEditId}`,
        {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body:
                JSON.stringify(dados)

        }
    );

    // Informa que a atualização foi realizada.
    alert("Cliente atualizado");

    // Finaliza o estado de edição.
    clienteEditId = null;

    // Atualiza a tabela de clientes.
    carregarClientes();

}


/* =========================================================
   EXCLUIR CLIENTE (DELETE)
========================================================= */

async function excluirCliente(id) {

    // Solicita confirmação antes de excluir o cliente.
    if (!confirm("Excluir este cliente?"))
        return;

    // Envia a solicitação de exclusão para a API.
    await fetch(
        `${API}/admin/clientes/${id}`,
        {
            method: "DELETE"
        }
    );

    // Atualiza a listagem após a exclusão.
    carregarClientes();

}


/* =========================================================
   CONTROLE DO INDICADOR DE CARREGAMENTO
========================================================= */

// Exibe o overlay de carregamento.
function showLoading() {

    document
        .getElementById("loadingOverlay")
        .classList.add("show");

}

// Oculta o overlay de carregamento.
function hideLoading() {

    document
        .getElementById("loadingOverlay")
        .classList.remove("show");

}


/* =========================================================
   CRIAÇÃO DE PLACEHOLDERS (ESQUELETOS DE CARDS)
========================================================= */

function criarPlaceholders() {

    // Armazena o HTML dos placeholders.
    let html = "";

    // Gera seis estruturas de carregamento.
    for (let i = 0; i < 6; i++) {

        html += `
            <div class="card-placeholder">

                <div class="placeholder-img"></div>

                <div class="placeholder-title"></div>

                <div class="placeholder-text"></div>

            </div>
        `;

    }

    // Retorna o HTML gerado para utilização em outra função.
    return html;

}
