document.addEventListener('DOMContentLoaded', () => {

    const search = document.querySelector('.search'),
        cartBtn = document.querySelector('#cart'),
        wishListBtn = document.querySelector('#wishlist'),
        goodsWrapper = document.querySelector('.goods-wrapper'),
        cart = document.querySelector('.cart'),
        category = document.querySelector('.category');


    const getGoods = (handler, filter) => {
        fetch('db/db.json')
            .then(response => response.json())
            .then(filter)
            .then(handler);
    };

    const createCardGoods = (id, title, price, img) => {
        const card = document.createElement('div');
        card.classList = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
        card.innerHTML = `<div class="card">
        <div class="card-img-wrapper">
        <img class="card-img-top" src="${img}" alt="">
        <button class="card-add-wishlist" data-goods-id="${id}"></button>
    </div>
    <div class="card-body justify-content-between">
        <a href="#" class="card-title">${title}</a>
        <div class="card-price">${price} ₽</div>
        <div>
            <button class="card-add-cart" data-goods-id="${id}">Добавить в корзину</button>
        </div>
    </div>
</div>`;
        return card;
    };

    const renderCard = items => {
        goodsWrapper.textContent = '';
        items.forEach(item => {
            let { id, title, price, imgMin } = item;
            goodsWrapper.appendChild(createCardGoods(id, title, price, imgMin));
        });
    };

    goodsWrapper.appendChild(createCardGoods(1, 'Дартс', 2000, 'img/temp/archer.jpg'));
    goodsWrapper.appendChild(createCardGoods(2, 'Фламинго', 3000, 'img/temp/flamingo.jpg'));
    goodsWrapper.appendChild(createCardGoods(3, 'Носки', 333, 'img/temp/socks.jpg'));


    const closeCart = (e) => {
        const target = e.target;
        if (target === cart || target.classList.contains('cart-close') || e.keyCode === 27) {
            cart.style.display = 'none';
            document.removeEventListener('keydown', closeCart);
        }
    };
    const openCart = (event) => {
        event.preventDefault();
        cart.style.display = 'flex';
        document.addEventListener('keydown', closeCart);
    };

    const randomSort = (item) => {
        return item.sort(() => Math.random() - 0.5);
    };

    const choiseCategory = e => {
        e.preventDefault();
        let target = e.target;

        if (target.classList.contains('category-item')) {
            const categor = target.dataset.category;
            getGoods(renderCard, good => {
                const newGoods = good.filter(item => {
                    return item.category.includes(categor);
                });
                return newGoods;
            });
        };
    };


    cartBtn.addEventListener('click', openCart);
    cart.addEventListener('click', closeCart);
    category.addEventListener('click', choiseCategory);

    getGoods(renderCard, randomSort);

});