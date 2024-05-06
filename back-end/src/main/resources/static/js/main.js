document.addEventListener("DOMContentLoaded", function() {
    var userId = localStorage.getItem('userId');

    if (!userId) {
        var urlParams = new URLSearchParams(window.location.search);
        userId = urlParams.get('userId');
        localStorage.setItem('userId', userId);
    }

    if (window.history.replaceState) {
        var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({path: newUrl}, '', newUrl);
    }
});

var currentDate = new Date();
var sessionEndDate = new Date(localStorage.getItem('sessionEnd'));

if (localStorage.getItem('loggedIn') === 'true' && currentDate <= sessionEndDate) {
} else {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('sessionEnd');
    window.location.href = '/login';
}

function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('sessionEnd');
    window.location.href = '/login';
}

window.onload = function() {
    var username = localStorage.getItem('userId');
    if (username) {
        var usernameDisplay = document.getElementById('usernameDisplay');
        if (usernameDisplay) {
            usernameDisplay.textContent = 'Bem-vindo, Usuário ' + username + '!';
        } else {
            console.error('Elemento com ID "usernameDisplay" não encontrado.');
        }
    }
};

function toggleDropdown() {
    document.querySelector('.dropdown').classList.toggle('hidden');
}

const toggleSidebar = () => {
    document.querySelector('.sidebar').classList.toggle('active');
}