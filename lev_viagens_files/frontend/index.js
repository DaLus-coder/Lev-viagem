const API = "https://lev-viagem.onrender.com/api";


/* =========================================================
   INICIALIZAÇÃO GERAL DA PÁGINA
========================================================= */

window.addEventListener("DOMContentLoaded", async () => {

    initTabs();
    initMainCarousel();
    initMiniCarousels();

    await loadCMS();

});


/* =========================================================
   CARREGAMENTO DO CMS (BACKEND -> FRONTEND)
========================================================= */

async function loadCMS() {

    const skeleton = document.getElementById("carouselSkeleton");

    // Skeleton aparece imediatamente
    if (skeleton) {
        skeleton.classList.remove("hidden");
    }

    try {

        // Busca cards no backend
        const res = await fetch(API + "/cards");

        if (!res.ok) {
            throw new Error("Erro ao carregar cards");
        }

        const cards = await res.json();

        // Mapeamento das categorias para seus containers
        const maps = {
            alugueis: document.getElementById("alugueis-track"),
            experiencias: document.getElementById("experiencias-track"),
            gastronomia: document.getElementById("gastronomia-track")
        };

        // Limpa containers antes de renderizar
        Object.values(maps).forEach(el => {
            if (el) {
                el.innerHTML = "";
            }
        });

        // Distribui cards por categoria
        cards.forEach(card => {

            const el = createCard(card);

            if (maps[card.categoria]) {
                maps[card.categoria].appendChild(el);
            }

        });

    } catch (err) {

        console.error("Erro ao carregar CMS:", err);

    } finally {

        // Remove skeleton quando terminar
        if (skeleton) {
            skeleton.classList.add("hidden");
        }

    }

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

    if (card.categoria === "experiencias") {

        const mensagem = encodeURIComponent(
            `Olá, tenho interesse em ${card.titulo}`
        );

        const experienciaUrl =
            `https://parksnet.com.br/destino/serra-gaucha?bookingAgency=6641`;

        botaoHtml = `
            <button onclick="window.open('${experienciaUrl}','_blank')">
                ${card.botao_texto}
            </button>
        `;
    }

    if (card.categoria === "gastronomia") {

        const mensagem = encodeURIComponent(
            `Olá, tenho interesse em ${card.titulo}`
        );

        const gastronomiaUrl =
            `https://parksnet.com.br/destino/serra-gaucha?bookingAgency=6641&tab=gastronomia`;

        botaoHtml = `
            <button onclick="window.open('${gastronomiaUrl}','_blank')">
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
   MINI CARROSSEIS (TABS)
========================================================= */

function initMiniCarousels() {

    const carousels = document.querySelectorAll(".mini-carousel");

    carousels.forEach(carousel => {

        const track = carousel.querySelector(".mini-track");
        const prev = carousel.querySelector(".prev");
        const next = carousel.querySelector(".next");

        if (!track || !prev || !next) return;

        let index = 0;

        // calcula largura real do card
        function getCardWidth() {
            const card = track.querySelector(".mini-card");
            if (!card) return 0;
            return card.getBoundingClientRect().width + 20; // margem
        }

        // atualiza posição do carrossel
        function update() {
            const width = getCardWidth();
            track.style.transform = `translateX(-${index * width}px)`;
        }

        // botão anterior
        prev.addEventListener("click", () => {
            const max = track.children.length - 1;
            index = Math.max(0, index - 1);
            update();
        });

        // botão próximo
        next.addEventListener("click", () => {
            const max = track.children.length - 1;
            index = Math.min(max, index + 1);
            update();
        });

        // responsividade
        window.addEventListener("resize", update);

        update();
    });
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