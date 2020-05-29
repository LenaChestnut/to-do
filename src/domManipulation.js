import PubSub from 'pubsub-js'
import * as storage from './storage.js'

export const container = document.getElementById("container");

export const menuBtn = document.querySelector('.menu-btn');

export const menuPanel = document.createElement('div');
menuPanel.classList.add('menu-panel');

function loadMenuPanel() {
    container.appendChild(menuPanel);
    PubSub.publish('MENU OPEN');
}

function hideMenuPanel() {
    menuPanel.remove();
}

function isMenuOpen() {
    if (container.contains(menuPanel)) {
        return true;
    }
}

export function toggleMenuPanel() {
    if (isMenuOpen()) {
        hideMenuPanel();
    } else {
        loadMenuPanel();
    }
}