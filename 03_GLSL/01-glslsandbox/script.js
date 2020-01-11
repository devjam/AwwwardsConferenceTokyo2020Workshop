
import Fragmen from './fragmen.js';

window.addEventListener('DOMContentLoaded', () => {
    fetch('./fs1.frag')
    .then((response) => {
        return response.text();
    })
    .then((source) => {
        const target = document.body;
        const option = {
            target: target,
            eventTarget: window,
            mouse: true,
            resize: true,
            escape: true
        };
        const frag = new Fragmen(option).render(source);
    });
}, false);

