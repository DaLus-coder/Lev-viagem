if (localStorage.getItem("adminLogado") !== "true") {
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


    showLoading();


    try {


        const res = await fetch(API + "/cards");


        const cards = await res.json();



        const alugueis = document.getElementById("listaAlugueis");
        const experiencias = document.getElementById("listaExperiencias");
        const gastronomia = document.getElementById("listaGastronomia");


        alugueis.innerHTML = "";
        experiencias.innerHTML = "";
        gastronomia.innerHTML = "";



        cards.forEach(card => {


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



            if(card.categoria === "alugueis"){

                alugueis.innerHTML += html;

            }


            if(card.categoria === "experiencias"){

                experiencias.innerHTML += html;

            }


            if(card.categoria === "gastronomia"){

                gastronomia.innerHTML += html;

            }



        });



    }


    finally {


        hideLoading();


    }


}

/* =========================================================
   SALVAR / CRIAR OU ATUALIZAR CARD (CREATE / UPDATE)
========================================================= */

async function saveCard() {

    const btnSalvar = document.getElementById("btnSalvar");


    btnSalvar.disabled = true;

    btnSalvar.innerText = "Salvando...";

    // Captura valores do formulário
    const titulo = document.getElementById("titulo").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const imagem = document.getElementById("imagem").value.trim();
    const categoria = document.getElementById("categoria").value;
    const botao_texto = document.getElementById("botao_texto").value.trim();

    // Validação simples
    if (!titulo || !descricao || !imagem || !categoria || !botao_texto) {

    alert("Preencha todos os campos!");

    btnSalvar.disabled = false;
    btnSalvar.innerText = "Salvar";

    return;
}

    // Confirmação do usuário
    if (!confirm("Tem certeza?")) {

    btnSalvar.disabled = false;
    btnSalvar.innerText = "Salvar";

    return;

}

    // Payload enviado ao backend
    const data = { titulo, descricao, imagem, categoria, botao_texto };

    // Define se é criação ou edição
    const url = editId
        ? `${API}/admin/cards/${editId}`
        : `${API}/admin/cards`;

    const method = editId ? "PUT" : "POST";

    showLoading();


try {


    await fetch(url, {

        method,

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(data)

    });


    editId = null;


    clear();


    await load();


}


finally{


    btnSalvar.disabled = false;


    btnSalvar.innerText = "Salvar";


    hideLoading();


}
}


/* =========================================================
   EDITAR CARD (LOAD DADOS NO FORMULÁRIO)
========================================================= */

async function edit(id) {

    // Busca todos os cards
    const res = await fetch(API + "/cards");
    const cards = await res.json();

    // Encontra card pelo ID
    const c = cards.find(x => Number(x.id) === Number(id));

    if (!c) {
        console.error("Card não encontrado. ID recebido:", id);
        console.log(cards);
        return;
    }

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


    showLoading();



    try {


        await fetch(API + "/admin/cards/" + id, {


            method: "DELETE"


        });



        await load();



    }



    finally {


        hideLoading();



    }



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


    showLoading();


    const fileInput = document.getElementById("file");

    const imagemInput = document.getElementById("imagem");



    if(!fileInput.files.length){


        alert("Selecione uma imagem primeiro!");


        hideLoading();

        return;


    }



    const formData = new FormData();


    formData.append(
        "imagem",
        fileInput.files[0]
    );



    try {


        const res = await fetch(
            `${API}/upload`,
            {

                method:"POST",

                body:formData

            }
        );



        const data = await res.json();



        if(!data.url){


            alert("Erro no upload");


            return;


        }



        imagemInput.value = data.url;



        alert("Upload concluído!");



    }


    catch(err){


        console.error(err);


        alert("Erro ao enviar imagem");


    }


    finally{


        hideLoading();


    }


}


/* =========================================================
   INICIALIZAÇÃO DO SISTEMA
========================================================= */

// Carrega cards ao abrir página
load();

function logoutAdmin() {

    localStorage.removeItem(
        "adminLogado"
    );

    window.location.href =
        "login.html";
}

async function carregarClientes() {

    const res = await fetch(
        `${API}/admin/clientes`
    );

    const clientes = await res.json();


    const tabela =
        document.getElementById("listaClientes");


    tabela.innerHTML = "";


    clientes.forEach(cliente => {


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

function mostrarSecao(secao) {


    const secaoCards =
        document.getElementById("secaoCards");


    const clientes =
        document.getElementById("clientes");


    const botoes =
        document.querySelectorAll(".nav-item");



    // remove amarelo de todos

    botoes.forEach(botao => {
        botao.classList.remove("active");
    });



    if (secao === "clientes") {


        secaoCards.style.display = "none";

        clientes.style.display = "block";


        botoes[1].classList.add("active");


        carregarClientes();


    } else {


        secaoCards.style.display = "block";

        clientes.style.display = "none";


        botoes[0].classList.add("active");


    }

}

async function editarCliente(id) {


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

async function salvarCliente() {


    if (!clienteEditId) {

        alert("Selecione um cliente primeiro");

        return;

    }


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


    alert("Cliente atualizado");


    clienteEditId = null;


    carregarClientes();

}

async function excluirCliente(id) {


    if (!confirm("Excluir este cliente?"))
        return;


    await fetch(
        `${API}/admin/clientes/${id}`,
        {
            method: "DELETE"
        }
    );


    carregarClientes();


}

function showLoading() {

    document
        .getElementById("loadingOverlay")
        .classList.add("show");

}

function hideLoading() {

    document
        .getElementById("loadingOverlay")
        .classList.remove("show");

}

function criarPlaceholders() {


    let html = "";


    for (let i = 0; i < 6; i++) {


        html += `

<div class="card-placeholder">


<div class="placeholder-img"></div>


<div class="placeholder-title"></div>


<div class="placeholder-text"></div>


</div>


`;


    }


    return html;


}
