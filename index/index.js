document.addEventListener("DOMContentLoaded", () => {
    const buyNowBtn = document.querySelector('.description button');
    const viewMoreBtn = document.querySelector('.button-viewmore');
   
    const exploreMoreBtn = document.querySelector('.button-explore');

    const goToShop = () => {
        window.location.href = '/shop/shop.html';
    };

    if (buyNowBtn) buyNowBtn.addEventListener('click', goToShop);
    if (viewMoreBtn) viewMoreBtn.addEventListener('click', goToShop);
    if (exploreMoreBtn) exploreMoreBtn.addEventListener('click', goToShop);
    const productCards = document.querySelectorAll('.card, .card-sale, .card-new');

    productCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            const isAction = e.target.closest('button') || e.target.closest('.action a');
            if (!isAction) {
                window.location.href = './product/single-product.html';
            }
        });
    });
});