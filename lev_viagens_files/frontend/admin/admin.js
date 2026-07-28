if(localStorage.getItem("adminLogado") !== "true"){
    window.location.href = "login.html";
}

/* =========================================================
   CONFIGURAÇÃO BASE DA API E VARIÁVEIS GLOBAIS
========================================================= */

const API = "https://lev-viagem.onrender.com/api";

// ID do card em edição (null = criando novo)
let editId = null;
let clienteEditId = null;


/* =========================================================
   SIDEBAR MOBILE (ABRIR / FECHAR MENU)
========================================================= */

// Elementos do DOM
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const menuToggle = document.getElementById("menuToggle");

// Abre/fecha sidebar ao clicar no botão do menu
menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
});

// Fecha sidebar ao clicar fora (overlay)
overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
});


/* =========================================================
   CARREGAMENTO DOS CARDS (READ / LISTAGEM)
========================================================= */

async function load() {

    // Busca todos os cards na API
    const res = await fetch(API + "/cards");
    const cards = await res.json();

    // Container principal onde os cards serão renderizados
    const container = document.getElementById("cards");
    container.innerHTML = "";

    // Organização por categoria
    const grupos = {
        alugueis: [],
        experiencias: [],
        gastronomia: []
    };

    // Separa cards por categoria
    cards.forEach(c => {
        if (grupos[c.categoria]) grupos[c.categoria].push(c);
    });

    // Renderiza cada grupo de categoria
    for (let grupo in grupos) {

        // Título da categoria
        const title = document.createElement("h2");
        title.textContent = grupo.toUpperCase();
        container.appendChild(title);

        // Grid dos cards da categoria
        const grid = document.createElement("div");
        grid.className = "cards-grid";

        // Criação dos cards individuais
        grupos[grupo].forEach(c => {

            const div = document.createElement("div");
            div.className = "card-admin";

            div.innerHTML = `
                <img src="${c.imagem}">
                <h4>${c.titulo}</h4>

                <div class="card-actions">
                    <button class="edit-btn" onclick="edit(${c.id})">Editar</button>
                    <button class="delete-btn" onclick="remove(${c.id})">Excluir</button>
                </div>
            `;

            grid.appendChild(div);
        });

        container.appendChild(grid);
    }
}


/* =========================================================
   SALVAR / CRIAR OU ATUALIZAR CARD (CREATE / UPDATE)
========================================================= */

async function saveCard() {

    // Captura valores do formulário
    const titulo = document.getElementById("titulo").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const imagem = document.getElementById("imagem").value.trim();
    const categoria = document.getElementById("categoria").value;
    const botao_texto = document.getElementById("botao_texto").value.trim();

    // Validação simples
    if (!titulo || !descricao || !imagem || !categoria || !botao_texto) {
        alert("Preencha todos os campos!");
        return;
    }

    // Confirmação do usuário
    if (!confirm("Tem certeza?")) return;

    // Payload enviado ao backend
    const data = { titulo, descricao, imagem, categoria, botao_texto };

    // Define se é criação ou edição
    const url = editId
        ? `${API}/admin/cards/${editId}`
        : `${API}/admin/cards`;

    const method = editId ? "PUT" : "POST";

    // Envia para API
    await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    // Reset estado de edição
    editId = null;

    // Limpa formulário e recarrega lista
    clear();
    load();
}


/* =========================================================
   EDITAR CARD (LOAD DADOS NO FORMULÁRIO)
========================================================= */

async function edit(id) {

    // Busca todos os cards
    const res = await fetch(API + "/cards");
    const cards = await res.json();

    // Encontra card pelo ID
    const c = cards.find(x => x.id === id);

    // Marca como edição
    editId = id;

    // Preenche formulário
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

    // Confirmação antes de excluir
    if (!confirm("Excluir card?")) return;

    // Requisição DELETE
    await fetch(`${API}/admin/cards/${id}`, {
        method: "DELETE"
    });

    // Atualiza lista
    load();
}


/* =========================================================
   LIMPAR FORMULÁRIO
========================================================= */

function clear() {
    document.getElementById("titulo").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("imagem").value = "";
    document.getElementById("botao_texto").value = "";
}


/* =========================================================
   UPLOAD DE IMAGEM (ENVIO PARA BACKEND)
========================================================= */

async function uploadImagem() {

    const fileInput = document.getElementById("file");
    const imagemInput = document.getElementById("imagem");

    // Validação de elementos HTML
    if (!fileInput) {
        alert("Input de arquivo não encontrado");
        return;
    }

    if (!imagemInput) {
        alert("Input de URL (imagem) não encontrado no HTML");
        return;
    }

    // Verifica se arquivo foi selecionado
    if (!fileInput.files || fileInput.files.length === 0) {
        alert("Selecione uma imagem primeiro!");
        return;
    }

    // Cria payload de upload
    const formData = new FormData();
    formData.append("imagem", fileInput.files[0]);

    try {
        // Envia imagem para backend
        const res = await fetch(`${API}/upload`, {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        // Validação de resposta
        if (!data.url) {
            alert("Upload falhou no backend");
            return;
        }

        // Preenche input com URL retornada
        imagemInput.value = data.url;

        alert("Upload concluído!");

    } catch (err) {
        console.error(err);
        alert("Erro ao enviar imagem");
    }
}


/* =========================================================
   INICIALIZAÇÃO DO SISTEMA
========================================================= */

// Carrega cards ao abrir página
load();

function logoutAdmin(){

    localStorage.removeItem(
        "adminLogado"
    );

    window.location.href =
        "login.html";
}

async function carregarClientes(){

    const res = await fetch(
        `${API}/admin/clientes`
    );

    const clientes = await res.json();


    const tabela =
    document.getElementById("listaClientes");


    tabela.innerHTML="";


    clientes.forEach(cliente=>{


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

function mostrarSecao(secao){


    const cards =
    document.getElementById("cards");


    const clientes =
    document.getElementById("clientes");


    if(secao === "clientes"){

        cards.style.display="none";
        clientes.style.display="block";

        carregarClientes();

    }else{

        cards.style.display="block";
        clientes.style.display="none";

    }

}

async function editarCliente(id){


    const res = await fetch(
        `${API}/admin/clientes`
    );


    const clientes = await res.json();


    const cliente = clientes.find(
        c => c.id === id
    );


    clienteEditId = id;


    document.getElementById("clienteNome").value =
    cliente.nome;


    document.getElementById("clienteEmail").value =
    cliente.email;


    document.getElementById("clienteCidade").value =
    cliente.cidade || "";


    document.getElementById("clienteTelefone").value =
    cliente.telefone || "";


}

async function salvarCliente(){


    if(!clienteEditId){

        alert("Selecione um cliente primeiro");

        return;

    }


    const dados={

        nome:
        document.getElementById("clienteNome").value,


        email:
        document.getElementById("clienteEmail").value,


        cidade:
        document.getElementById("clienteCidade").value,


        telefone:
        document.getElementById("clienteTelefone").value

    };


    await fetch(
        `${API}/admin/clientes/${clienteEditId}`,
        {

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body:
        JSON.stringify(dados)

        }
    );


    alert("Cliente atualizado");


    clienteEditId=null;


    carregarClientes();

}

async function excluirCliente(id){


    if(!confirm("Excluir este cliente?"))
    return;


    await fetch(
        `${API}/admin/clientes/${id}`,
        {
            method:"DELETE"
        }
    );


    carregarClientes();


}