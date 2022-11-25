import RealEstates from '../components/RealEstates.js';

const nlRealEstates = document.querySelectorAll('[data-real-estates]');

nlRealEstates.forEach(el => new RealEstates(el, {
    medias: [
        {
            media: '(min-width: 37.5em)',
            settings: {
                moreInitial: 4,
                moreItems: 8,
            },
        },
        {
            media: '(min-width: 56.25em)',
            settings: {
                pagination: true,
                paginationItemsPerPage: 6,
                more: false,
            },
        },
    ],
}));
