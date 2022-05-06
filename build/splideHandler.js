import Splide from './scripts/node_modules/@splidejs/splide/dist/js/splide.js';
new Splide('.splide', {
    type: "slide",
    fixedWidth: 350,
    fixedHeight: 175,
    perPage: 3,
    gap: "1rem",
    rewind: true,
    pagination: false,
    breakpoints: {
        850: {
            fixedWidth: 60,
            fixedHeight: 44,
        },
    },
}).mount();
