document.addEventListener('DOMContentLoaded', () => {

    const search = document.querySelector('.search'),
        cartBtn = document.querySelector('#cart'),
        wishListBtn = document.querySelector('#wishlist'),
        goodsWrapper = document.querySelector('.goods-wrapper'),
        cart = document.querySelector('.cart'),
        category = document.querySelector('.category'),
        cardCounter = cartBtn.querySelector('.counter'),
        wishlistCounter = wishListBtn.querySelector('.counter');

    let wishlist = [];

    // Spiner

    const loading = () => {
        goodsWrapper.innerHTML = `<div id="spinner"><div class="spinner-loading"><div><div><div></div>
</div><div><div></div></div><div><div></div></div><div><div></div></div></div></div></div>`
    };

    // ****************************





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



    goodsWrapper.appendChild(createCardGoods(1, 'Дартс', 2000, 'img/temp/archer.jpg'));
    goodsWrapper.appendChild(createCardGoods(2, 'Фламинго', 3000, 'img/temp/flamingo.jpg'));
    goodsWrapper.appendChild(createCardGoods(3, 'Носки', 333, 'img/temp/socks.jpg'));


    // Полечуние карточек товара

    const renderCard = items => {
        goodsWrapper.textContent = '';
        if (items.length) {
            items.forEach(item => {
                let {
                    id,
                    title,
                    price,
                    imgMin
                } = item;
                goodsWrapper.appendChild(createCardGoods(id, title, price, imgMin));
            });
        } else {
            goodsWrapper.textContent = '❌ Извините, мы не нашли товаров по вашему запросу...';
        }

    };

    // ***************************************************************************



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

    // Фильтр по категориям

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

    // *************************************************************



    // Поиск

    const searchGoods = e => {
        e.preventDefault();
        const input = e.target.elements.searchGoods;
        const inputValue = input.value.trim();
        if (inputValue !== '') {
            const searchString = new RegExp(inputValue, 'i');
            getGoods(renderCard, goods => goods.filter(item => searchString.test(item.title)))
        } else {
            search.classList.add('error');
            setTimeout(() => {
                search.classList.remove('error');
            }, 2000);
        }
        input.value = '';
    };

    // *********************************************



   // Количество с избранном

   const checkCount = () => {
    wishlistCounter.textContent = wishlist.length;
};

// ******************************************************************************


    // Добавление в избранное


    const toggleWishlist = (id, elem) => {
        if (wishlist.includes(id)) {
            wishlist.splice(wishlist.indexOf(id), 1);
            elem.classList.remove('active');
        } else {
            wishlist.push(id);
            elem.classList.add('active');
        }
        console.log(wishlist);
        checkCount();
        storageQuery();
    };

    const heandlerGoods = e => {
        let target = e.target;
        if (target.classList.contains('card-add-wishlist')) {
            toggleWishlist(target.dataset.goodsId, target);
        }
    };

    // ******************************************************************************



 



    const storageQuery = (get) => {

        if (get) {
            if (localStorage.getItem('wishlist')) {
                JSON.parse(localStorage.getItem('wishlist')).forEach(id => wishlist.push(id));
            }
        } else {
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
checkCount();

    };



    cartBtn.addEventListener('click', openCart);
    cart.addEventListener('click', closeCart);
    category.addEventListener('click', choiseCategory);
    search.addEventListener('submit', searchGoods);
    goodsWrapper.addEventListener('click', heandlerGoods);


    const getGoods = (handler, filter) => {
        loading();
        fetch('db/db.json')
            .then(response => response.json())
            .then(filter)
            .then(handler);
    };


    getGoods(renderCard, randomSort);

});