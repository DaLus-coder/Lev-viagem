function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}

function isLogged() {
    return !!getUser();
}

function logout() {
    localStorage.removeItem("user");
    location.reload();
}

function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}

function isLogged() {
    return !!getUser();
}

function logout() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}