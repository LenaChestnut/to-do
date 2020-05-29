export const container = document.getElementById("container");

export const menuBtn = document.querySelector('.menu-btn');

export const menuPanel = document.createElement('div');
menuPanel.classList.add('menu-panel');

export function toggleMenuPanel() {
    if (isMenuOpen()) {
        hideMenuPanel();
    } else {
        loadMenuPanel();
    }
}

function loadMenuPanel() {
    container.appendChild(menuPanel);
}

function hideMenuPanel() {
    menuPanel.remove();
}

function isMenuOpen() {
    if (container.contains(menuPanel)) {
        return true;
    }
}