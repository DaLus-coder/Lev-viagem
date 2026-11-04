const API = "https://lev-viagem.onrender.com/api";
let allCMSCards = [];


/* =========================================================
   INICIALIZAÇÃO GERAL DA PÁGINA
========================================================= */

window.addEventListener("load", async () => {

    initMainCarousel();

    // Primeiro carrega os cards do banco
    await loadCMS();

    // Depois inicializa os carrosséis das categorias
    initMiniCarousels();
});


/* =========================================================
   CARREGAMENTO DO CMS (BACKEND -> FRONTEND)
========================================================= */

async function loadCMS() {

    // Busca cards no backend
    const res = await fetch(API + "/cards");

if (!res.ok) {
    throw new Error("Não foi possível carregar os serviços.");
}

const cards = await res.json();

if (!Array.isArray(cards)) {
    throw new Error("A API não retornou uma lista de serviços.");
}

allCMSCards = cards;

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

/* =========================================================
   MINI CARROSSEIS DAS CATEGORIAS
========================================================= */

function initMiniCarousels() {

    const carousels = document.querySelectorAll(".mini-carousel");

    carousels.forEach(carousel => {

        const track = carousel.querySelector(".mini-track");
        const prev = carousel.querySelector(".prev");
        const next = carousel.querySelector(".next");
        const windowElement = carousel.querySelector(".mini-window");

        if (!track || !prev || !next || !windowElement) return;

        let position = 0;

        function getStep() {
            const card = track.querySelector(".mini-card");

            if (!card) return 0;

            const styles = window.getComputedStyle(track);
            const gap = parseFloat(styles.columnGap) || 20;

            return card.getBoundingClientRect().width + gap;
        }

        function update() {

            const maxPosition = Math.max(
                0,
                track.scrollWidth - windowElement.clientWidth
            );

            position = Math.min(position, maxPosition);
            position = Math.max(0, position);

            track.style.transform = `translateX(-${position}px)`;

            prev.disabled = position <= 0;
            next.disabled = position >= maxPosition;
        }

        prev.addEventListener("click", () => {
            position -= getStep();
            update();
        });

        next.addEventListener("click", () => {
            position += getStep();
            update();
        });

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



/* =========================================
   MENU MOBILE
========================================= */

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", (event) => {
        event.stopPropagation();

        const aberto = mobileMenu.classList.toggle("active");

        menuBtn.setAttribute("aria-expanded", String(aberto));

        menuBtn.innerHTML = aberto
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';
    });

    mobileMenu.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    document.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            mobileMenu.classList.remove("active");
            menuBtn.setAttribute("aria-expanded", "false");
            menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
    });
}


/* =========================================
   PESQUISA DE SERVIÇOS
========================================= */

function initSearch() {
    const searchBtn = document.getElementById("searchBtn");
    const panel = document.getElementById("searchPanel");
    const input = document.getElementById("siteSearchInput");
    const closeBtn = document.getElementById("closeSearchBtn");
    const results = document.getElementById("searchResults");
    const status = document.getElementById("searchStatus");

    if (!searchBtn || !panel || !input || !closeBtn ||
        !results || !status) {
        return;
    }

    // Normaliza acentos para pesquisar "gastronomia"
    // mesmo se o usuário não digitar acentos.
    function normalize(text) {
        return String(text || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }

    
function openSearch() {
    panel.hidden = false;

    // Prepara o estado fechado antes de iniciar a transição.
    panel.classList.remove("search-closing");

    requestAnimationFrame(() => {
        panel.classList.add("search-visible");
        input.focus();
    });

    panel.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

    renderResults(input.value);
}

function closeSearch() {
    if (panel.hidden) return;

    panel.classList.remove("search-visible");
    panel.classList.add("search-closing");

    input.value = "";
    results.replaceChildren();

    status.textContent =
        "Pesquise aluguéis, passeios e gastronomia.";

    // Espera a animação terminar antes de ocultar.
    window.setTimeout(() => {
        if (!panel.classList.contains("search-visible")) {
            panel.hidden = true;
            panel.classList.remove("search-closing");
        }
    }, 350);
}


    function createResult(card) {
        const article = document.createElement("article");
        article.className = "search-result";

        const img = document.createElement("img");
        img.src = card.imagem || "";
        img.alt = card.titulo || "Serviço";
        img.loading = "lazy";

        img.addEventListener("error", () => {
            img.style.display = "none";
        });

        const info = document.createElement("div");
        info.className = "search-result-info";

        const title = document.createElement("h3");
        title.textContent = card.titulo || "Serviço";

        const description = document.createElement("p");
        description.textContent = card.descricao || "";

        const button = document.createElement("button");
        button.type = "button";
        button.textContent = card.botao_texto || "Ver serviço";

        button.addEventListener("click", () => {
            const category = normalize(card.categoria);
            let url = "";

            if (category === "alugueis") {
                const message = encodeURIComponent(
                    `Olá, tenho interesse em ${card.titulo}`
                );

                url = `https://wa.me/5554994049796?text=${message}`;
            } else if (category === "experiencias") {
                url = "https://parksnet.com.br/destino/serra-gaucha?bookingAgency=6641";
            } else if (category === "gastronomia") {
                url = "https://parksnet.com.br/destino/serra-gaucha?bookingAgency=6641&tab=gastronomia";
            }

            if (url) {
                window.open(url, "_blank", "noopener,noreferrer");
            }
        });

        info.append(title, description, button);
        article.append(img, info);

        return article;
    }

    function renderResults(value) {
        results.replaceChildren();

        const query = normalize(value);

        if (!query) {
            status.textContent =
                `${allCMSCards.length} serviços disponíveis. Digite para pesquisar.`;
            return;
        }

        const terms = query.split(/\s+/).filter(Boolean);

        const filtered = allCMSCards.filter(card => {
            const searchableText = normalize([
                card.titulo,
                card.descricao,
                card.categoria
            ].join(" "));

            return terms.every(term =>
                searchableText.includes(term)
            );
        });

        status.textContent = filtered.length
            ? `${filtered.length} resultado(s) encontrado(s).`
            : "Nenhum serviço encontrado.";

        if (!filtered.length) {
            const empty = document.createElement("p");
            empty.className = "search-empty";
            empty.textContent =
                "Não encontramos esse serviço. Tente outro nome ou categoria.";

            results.appendChild(empty);
            return;
        }

        filtered.forEach(card => {
            results.appendChild(createResult(card));
        });
    }

    searchBtn.addEventListener("click", openSearch);

    input.addEventListener("input", () => {
        renderResults(input.value);
    });

    closeBtn.addEventListener("click", closeSearch);

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !panel.hidden) {
            closeSearch();
            searchBtn.focus();
        }
    });
}

window.addEventListener("load", initSearch);

