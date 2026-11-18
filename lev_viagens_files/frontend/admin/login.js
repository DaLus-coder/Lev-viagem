
/* =========================================================
   CONFIGURAÇÃO DA API
========================================================= */

// Identifica se o sistema está sendo executado localmente
// ou no ambiente de produção.
//
// LOCAL: localhost:3000
// PRODUÇÃO: API hospedada no Render.

const API =
    location.hostname === "localhost"
        ? "http://localhost:3000/api"
        : "https://lev-viagem.onrender.com/api";


/* =========================================================
   LOGIN ADMINISTRATIVO (AUTENTICAÇÃO)
========================================================= */

async function loginAdmin() {

    // Captura o usuário informado no formulário.
    const usuario =
        document.getElementById("usuario").value;

    // Captura a senha informada no formulário.
    const senha =
        document.getElementById("senha").value;


    // Envia as credenciais para a rota de autenticação
    // administrativa do backend.
    const res = await fetch(
        API + "/admin/login",
        {
            // Define o método HTTP da requisição.
            method: "POST",

            // Informa que os dados serão enviados em JSON.
            headers: {
                "Content-Type": "application/json"
            },

            // Converte usuário e senha para JSON.
            body: JSON.stringify({
                usuario,
                senha
            })
        }
    );


    // Converte a resposta do servidor para JSON.
    const data = await res.json();


    // Verifica se a autenticação foi rejeitada
    // ou se ocorreu algum erro na requisição.
    if (!res.ok) {

        // Exibe a mensagem retornada pelo backend.
        // Caso não exista, utiliza uma mensagem genérica.
        alert(data.error || "Erro");

        return;
    }


    // Registra no navegador que o administrador
    // realizou o login.
    //
    // Observação: este registro é utilizado pelo admin.js
    // para controlar o redirecionamento da página.
    localStorage.setItem(
        "adminLogado",
        "true"
    );


    // Redireciona o administrador para o painel CMS.
    window.location.href = "index.html";

}
