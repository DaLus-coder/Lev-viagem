const API = "https://lev-viagem.onrender.com/api";


/* =========================================================
   INICIALIZAÇÃO GERAL DA PÁGINA
========================================================= */

window.addEventListener("load", async () => {

    // Inicializa componentes da UI
    initTabs();
    initMainCarousel();

    // Carrega dados do CMS
    await loadCMS();
});


/* =========================================================
   CARREGAMENTO DO CMS (BACKEND -> FRONTEND)
========================================================= */

async function loadCMS() {

    // Busca cards no backend
    const res = await fetch(API + "/cards");
    const cards = await res.json();

    // Mapeamento das categorias para seus containers
    const maps = {
        alugueis: document.getElementById("alugueis-track"),
        experiencias: document.getElementById("experiencias-track"),
        gastronomia: document.getElementById("gastronomia-track")
    };

    // Limpa containers antes de renderizar
    Object.values(maps).forEach(el => {
        if (el) el.innerHTML = "";
    });

    // Distribui cards por categoria
    cards.forEach(card => {
        const el = createCard(card);

        if (maps[card.categoria]) {
            maps[card.categoria].appendChild(el);
        }
    });
}


/* =========================================================
   CRIAÇÃO DE CARD (MINI CARD DOS TABS)
========================================================= */

function createCard(card) {

    const div = document.createElement("div");
    div.className = "mini-card";

    let botaoHtml = `
        <button>${card.botao_texto}</button>
    `;

    // Apenas categoria alugueis
    if (card.categoria === "alugueis") {

        const mensagem = encodeURIComponent(
            `Olá, tenho interesse em ${card.titulo}`
        );

        const whatsappUrl =
            `https://wa.me/5554994049796?text=${mensagem}`;

        botaoHtml = `
            <button onclick="window.open('${whatsappUrl}','_blank')">
                ${card.botao_texto}
            </button>
        `;
    }

    div.innerHTML = `
        <img src="${card.imagem}">
        <h3>${card.titulo}</h3>
        <p>${card.descricao}</p>
        ${botaoHtml}
    `;

    return div;
}


/* =========================================================
   CARROSSEL PRINCIPAL (HERO CAROUSEL)
========================================================= */

function initMainCarousel() {

    const track = document.querySelector(".carousel-track");
    const cards = document.querySelectorAll(".carousel-track .card");
    const left = document.querySelector(".arrow.left");
    const right = document.querySelector(".arrow.right");
    const dots = document.querySelectorAll(".dot");

    // segurança caso elementos não existam
    if (!track || !cards.length || !left || !right) return;

    let index = 0;
    const total = cards.length;

    // atualiza posição e dots
    function update() {

        // move o carrossel
        track.style.transform = `translateX(-${index * 100}%)`;

        // atualiza indicadores (dots)
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });
    }

    // seta esquerda
    left.addEventListener("click", () => {
        index = Math.max(0, index - 1);
        update();
    });

    // seta direita
    right.addEventListener("click", () => {
        index = Math.min(total - 1, index + 1);
        update();
    });

    update();
}






/* =========================================================
   SISTEMA DE TABS
========================================================= */

function initTabs() {

    const buttons = document.querySelectorAll(".tab-btn");
    const contents = document.querySelectorAll(".tab-content");

    buttons.forEach(btn => {

        btn.addEventListener("click", () => {

            const target = btn.getAttribute("data-tab");

            // remove estado ativo de tudo
            buttons.forEach(b => b.classList.remove("active"));
            contents.forEach(c => c.classList.remove("active"));

            // ativa botão clicado
            btn.classList.add("active");

            // ativa conteúdo correspondente
            const section = document.getElementById(target);

            if (section) section.classList.add("active");
        });
    });
}


/* =========================================================
   MENU MOBILE
========================================================= */

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

// abre/fecha menu mobile
if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
    });
}

// fecha menu ao clicar fora
document.addEventListener("click", (e) => {
    if (
        !mobileMenu.contains(e.target) &&
        !menuBtn.contains(e.target)
    ) {
        mobileMenu.classList.remove("active");
    }
});

const user = JSON.parse(localStorage.getItem("user"));

function reservar() {

    if (!user) {
        alert("Você precisa estar logado");
        window.location.href = "login.html";
        return;
    }

    // continua reserva normalmente
}

//status login
function renderUser() {

    const area = document.getElementById("userArea");
    const user = getUser();

    if (!area) return;

    if (user) {
        area.innerHTML = `
            <span>Olá, ${user.nome}</span>
            <button onclick="logout()">Sair</button>
        `;
    } else {
        area.innerHTML = `
            <a href="login.html">Minha conta</a>
        `;
    }
}

window.addEventListener("load", renderUser);

function reservar() {

    const user = getUser();

    if (!user) {
        alert("Você precisa estar logado");
        window.location.href = "login.html";
        return;
    }

    // continua fluxo normal
}

window.addEventListener("load", () => {
    renderUser();
});

function renderUser() {

    const user = getUser();
    const area = document.getElementById("userArea");

    if (!area) return;

    if (user) {
        area.innerHTML = `
            <span>Bem-vindo, ${user.nome}</span>
            <button onclick="logout()">Sair</button>
        `;
    } else {
        area.innerHTML = `
            <a href="login.html">Minha conta</a>
        `;
    }
}