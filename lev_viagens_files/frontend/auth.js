// =========================================
// AUTENTICAÇÃO — LEV VIAGEM
// =========================================

// Recupera o usuário salvo
function getUser() {
    try {
        return JSON.parse(localStorage.getItem("user"));
    } catch (error) {
        console.error("Erro ao recuperar usuário:", error);
        return null;
    }
}

// Verifica se existe usuário logado
function isLogged() {
    return !!getUser();
}

// Encerra a sessão
function logout() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}

// =========================================
// ÁREA DO USUÁRIO NO MENU
// =========================================

function renderUserArea() {
    const userArea = document.getElementById("userArea");

    if (!userArea) return;

    // Limpa o conteúdo anterior
    userArea.innerHTML = "";

    const user = getUser();

    // SEM USUÁRIO LOGADO
    if (!user) {
        const loginButton = document.createElement("button");

        loginButton.textContent = "Entrar / Fazer login";

        loginButton.onclick = function () {
            window.location.href = "login.html";
        };

        userArea.appendChild(loginButton);

        return;
    }

    // USUÁRIO LOGADO
    const userName = document.createElement("p");

    userName.textContent = `Olá, ${user.nome || user.name || user.email || "usuário"}!`;

    userName.style.fontWeight = "700";
    userName.style.color = "#292929";

    const logoutButton = document.createElement("button");

    logoutButton.textContent = "Sair da conta";
    logoutButton.onclick = logout;

    userArea.appendChild(userName);
    userArea.appendChild(logoutButton);
}

// Inicializa a área do usuário
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderUserArea);
} else {
    renderUserArea();
}