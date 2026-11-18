
// =====================================================
// AUTENTICAÇÃO — LEV VIAGEM
// =====================================================
// Este arquivo controla:
// - Recuperação dos dados do usuário.
// - Verificação de sessão.
// - Encerramento da sessão.
// - Exibição da área do usuário no menu.
// =====================================================


// =====================================================
// 1. RECUPERA OS DADOS DO USUÁRIO
// =====================================================

function getUser() {
    try {
        // Recupera os dados salvos no localStorage
        // e converte o JSON para um objeto JavaScript.
        return JSON.parse(localStorage.getItem("user"));

    } catch (error) {
        // Caso os dados estejam corrompidos ou inválidos,
        // registra o erro e retorna null.
        console.error("Erro ao recuperar usuário:", error);

        return null;
    }
}


// =====================================================
// 2. VERIFICA SE EXISTE UM USUÁRIO LOGADO
// =====================================================

function isLogged() {
    // Retorna true se getUser() encontrar um usuário.
    // Caso contrário, retorna false.
    return !!getUser();
}


// =====================================================
// 3. ENCERRA A SESSÃO DO USUÁRIO
// =====================================================

function logout() {
    // Remove os dados do usuário armazenados no navegador.
    localStorage.removeItem("user");

    // Redireciona para a página inicial.
    window.location.href = "index.html";
}


// =====================================================
// 4. RENDERIZA A ÁREA DO USUÁRIO NO MENU
// =====================================================

function renderUserArea() {

    // Localiza o elemento responsável por exibir
    // as informações e os botões da conta do usuário.
    const userArea = document.getElementById("userArea");

    // Se o elemento não existir na página atual,
    // interrompe a execução para evitar erros.
    if (!userArea) return;


    // Remove qualquer conteúdo anterior da área do usuário.
    userArea.innerHTML = "";


    // Recupera os dados do usuário atualmente armazenados.
    const user = getUser();


    // -------------------------------------------------
    // USUÁRIO NÃO ESTÁ LOGADO
    // -------------------------------------------------

    if (!user) {

        // Cria o botão de acesso à página de login.
        const loginButton = document.createElement("button");

        loginButton.textContent = "Entrar / Fazer login";

        // Ao clicar, redireciona para a página de login.
        loginButton.onclick = function () {
            window.location.href = "login.html";
        };

        // Adiciona o botão à área do usuário.
        userArea.appendChild(loginButton);

        return;
    }


    // -------------------------------------------------
    // USUÁRIO ESTÁ LOGADO
    // -------------------------------------------------

    // Cria o elemento que exibirá o nome do usuário.
    const userName = document.createElement("p");

    // Utiliza o primeiro dado disponível nesta ordem:
    // nome → name → email → "usuário".
    userName.textContent = `Olá, ${user.nome || user.name || user.email || "usuário"}!`;

    // Define a aparência do texto.
    userName.style.fontWeight = "700";
    userName.style.color = "#292929";


    // Cria o botão para encerrar a sessão.
    const logoutButton = document.createElement("button");

    logoutButton.textContent = "Sair da conta";

    // Vincula o botão à função de logout.
    logoutButton.onclick = logout;


    // Adiciona o nome e o botão à área do usuário.
    userArea.appendChild(userName);
    userArea.appendChild(logoutButton);
}


// =====================================================
// 5. INICIALIZAÇÃO DA ÁREA DO USUÁRIO
// =====================================================

// Verifica se o HTML ainda está sendo carregado.
if (document.readyState === "loading") {

    // Se estiver carregando, aguarda o DOMContentLoaded
    // para executar a renderização com os elementos disponíveis.
    document.addEventListener("DOMContentLoaded", renderUserArea);

} else {

    // Se o HTML já estiver carregado, executa imediatamente.
    renderUserArea();
}
