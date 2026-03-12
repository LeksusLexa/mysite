(function () {
  'use strict';

  var WISHLIST_KEY = 'antenna_shop_wishlist_v1';
  var DEFAULT_IMAGE = 'assets/img/product/product1.webp';

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function escapeHtml(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function normalize(text) {
    return String(text || '').replace(/\s+/g, ' ').trim();
  }
  function formatPrice(value) {
    var num = Number(value) || 0;
    return num.toLocaleString('ru-RU') + ' ₽';
  }
  function productId(product) {
    return normalize(product.sku || product.slug || product.name).toLowerCase();
  }
  function readWishlist() {
    try {
      var raw = localStorage.getItem(WISHLIST_KEY);
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }
  function saveWishlist(list) {
    try { localStorage.setItem(WISHLIST_KEY, JSON.stringify(list || [])); } catch (e) {}
  }
  function syncWishlistButtons() {
    var ids = new Set(readWishlist().map(function (item) { return item.id; }));
    qsa('.product__card--action__btn[data-wishlist-dynamic="1"]').forEach(function (btn) {
      btn.classList.toggle('is-in-wishlist', ids.has(btn.getAttribute('data-wishlist-id')));
    });
  }
  function showWishlistNotice(text) {
    var prev = document.getElementById('wishlist-notice');
    if (prev) prev.remove();
    var node = document.createElement('div');
    node.id = 'wishlist-notice';
    node.className = 'wishlist__notice';
    node.innerHTML = '<span class="wishlist__notice--text">' + escapeHtml(text) + '</span><a class="wishlist__notice--link" href="wishlist.html">Перейти в избранное</a>';
    document.body.appendChild(node);
    window.setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, 2400);
  }
  function ensureWishlistDelegation() {
    if (window.__catalogDynamicWishlistBound) return;
    window.__catalogDynamicWishlistBound = true;

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.product__card--action__btn[data-wishlist-dynamic="1"]');
      if (!btn) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();

      var item = {
        id: btn.getAttribute('data-wishlist-id'),
        name: btn.getAttribute('data-name') || 'Товар',
        price: Number(btn.getAttribute('data-price')) || 0,
        img: btn.getAttribute('data-img') || DEFAULT_IMAGE,
        category: btn.getAttribute('data-category') || '',
        url: btn.getAttribute('data-url') || 'shop.html'
      };

      var list = readWishlist();
      var exists = list.some(function (x) { return x.id === item.id; });
      if (exists) {
        list = list.filter(function (x) { return x.id !== item.id; });
        saveWishlist(list);
        showWishlistNotice('Удалено из избранного');
      } else {
        list.push(item);
        saveWishlist(list);
        showWishlistNotice('Добавлено: ' + item.name);
      }
      syncWishlistButtons();
    });

    window.addEventListener('storage', function (e) {
      if (e.key === WISHLIST_KEY) syncWishlistButtons();
    });
    window.addEventListener('focus', syncWishlistButtons);
  }

  function uniqueNonEmpty(list) {
    var out = [];
    (list || []).forEach(function (value) {
      if (!value) return;
      if (out.indexOf(value) !== -1) return;
      out.push(value);
    });
    return out;
  }
  function quickviewDataFromCard(card) {
    var titleEl = qs('.product__card--title a, .product__card--title', card);
    var title = titleEl ? titleEl.textContent.trim() : 'Товар';
    var linkEl = qs('.product__card--title a, .product__card--thumbnail__link', card);
    var link = linkEl ? (linkEl.getAttribute('href') || 'shop.html') : 'shop.html';
    var currentPriceEl = qs('.product__card--price .current__price, .current__price', card);
    var oldPriceEl = qs('.product__card--price .old__price, .old__price', card);
    var categoryEl = qs('.product__card--meta__tag', card);
    var badgeEl = qs('.product__badge--items', card);
    var images = uniqueNonEmpty(qsa('img.product__card--thumbnail__img, .product__card--thumbnail img', card).map(function (img) {
      return img.getAttribute('src');
    }));
    return {
      title: title,
      link: link,
      currentPrice: currentPriceEl ? currentPriceEl.textContent.trim() : '',
      oldPrice: oldPriceEl ? oldPriceEl.textContent.trim() : '',
      category: categoryEl ? categoryEl.textContent.trim() : '',
      badge: badgeEl ? badgeEl.textContent.trim() : '',
      images: images
    };
  }
  function renderQuickview(data) {
    var modal = qs('#examplemodal');
    if (!modal || !data) return;
    var titleEl = qs('.product__details--info__title', modal);
    var currentPriceEl = qs('.quantity__product--price .current__price', modal);
    var oldPriceEl = qs('.quantity__product--price .old__price', modal);
    var descEl = qs('.product__details--info__desc', modal);
    var mainPreviewWrap = qs('.product__media--preview__horizontal .swiper-wrapper', modal);
    var navPreviewWrap = qs('.product__media--nav__horizontal .swiper-wrapper', modal);

    if (titleEl) titleEl.innerHTML = '<a href="' + escapeHtml(data.link) + '">' + escapeHtml(data.title) + '</a>';
    if (currentPriceEl && data.currentPrice) currentPriceEl.textContent = data.currentPrice;
    if (oldPriceEl) {
      oldPriceEl.textContent = data.oldPrice || '';
      oldPriceEl.style.display = data.oldPrice ? '' : 'none';
    }
    if (descEl) {
      descEl.textContent = data.category ? ('Категория: ' + data.category) : 'Надежное оборудование для усиления и распределения сигнала.';
    }
    if (mainPreviewWrap && navPreviewWrap && data.images && data.images.length) {
      mainPreviewWrap.innerHTML = data.images.map(function (src) {
        var badgeHtml = data.badge ? '<div class="product__badge"><span class="product__badge--items sale">' + escapeHtml(data.badge) + '</span></div>' : '';
        return '<div class="swiper-slide"><div class="product__media--preview__items"><a class="product__media--preview__items--link glightbox" data-gallery="product-media-preview" href="' + escapeHtml(src) + '"><img class="product__media--preview__items--img" src="' + escapeHtml(src) + '" alt="product-media-img"></a>' + badgeHtml + '</div></div>';
      }).join('');
      navPreviewWrap.innerHTML = data.images.map(function (src) {
        return '<div class="swiper-slide"><div class="product__media--nav__items"><img class="product__media--nav__items--img" src="' + escapeHtml(src) + '" alt="product-nav-img"></div></div>';
      }).join('');
      var previewSwiperEl = qs('.product__media--preview__horizontal', modal);
      var navSwiperEl = qs('.product__media--nav__horizontal', modal);
      if (navSwiperEl && navSwiperEl.swiper) {
        navSwiperEl.swiper.update();
        if (navSwiperEl.swiper.slideToLoop) navSwiperEl.swiper.slideToLoop(0, 0, false);
      }
      if (previewSwiperEl && previewSwiperEl.swiper) {
        previewSwiperEl.swiper.update();
        if (previewSwiperEl.swiper.slideToLoop) previewSwiperEl.swiper.slideToLoop(0, 0, false);
      }
    }
  }
  function ensureQuickviewDelegation() {
    if (window.__catalogDynamicQuickviewBound) return;
    window.__catalogDynamicQuickviewBound = true;
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('a.product__card--action__btn[title="Быстрый просмотр"]');
      if (!btn) return;
      var card = btn.closest('.product__card');
      if (!card) return;
      renderQuickview(quickviewDataFromCard(card));
    });
  }

  function productLink(product) {
    if (product && product.url) return product.url;
    if (product && product.sku) return 'product.html?sku=' + encodeURIComponent(product.sku);
    return 'shop.html';
  }
  function buildActionButtons(product) {
    var pid = escapeHtml(productId(product));
    var name = escapeHtml(product.name);
    var category = escapeHtml(product.category || 'Без категории');
    var price = escapeHtml(String(Number(product.price) || 0));
    var url = escapeHtml(productLink(product));
    var img = escapeHtml(product.image || DEFAULT_IMAGE);

    return [
      '<ul class="product__card--action d-flex align-items-center justify-content-center">',
      '<li class="product__card--action__list">',
      '<a class="product__card--action__btn" title="В избранное" href="wishlist.html" data-wishlist-dynamic="1" data-wishlist-id="', pid, '" data-name="', name, '" data-price="', price, '" data-img="', img, '" data-category="', category, '" data-url="', url, '">',
      '<svg class="product__card--action__btn--svg" xmlns="http://www.w3.org/2000/svg" width="25.51" height="22.443" viewBox="0 0 512 512"><path d="M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0018 0c96.26-65.34 184.09-143.09 183-252.42-.54-52.67-42.32-96.81-95.08-96.81z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path></svg>',
      '<span class="visually-hidden">В избранное</span>',
      '</a>',
      '</li>',
      '<li class="product__card--action__list">',
      '<a class="product__card--action__btn" title="Быстрый просмотр" data-bs-toggle="modal" data-bs-target="#examplemodal" href="javascript:void(0)">',
      '<svg class="product__card--action__btn--svg" xmlns="http://www.w3.org/2000/svg" width="24.51" height="22.443" viewBox="0 0 512 512"><path d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M338.29 338.29L448 448"></path></svg>',
      '<span class="visually-hidden">Быстрый просмотр</span>',
      '</a>',
      '</li>',
      '<li class="product__card--action__list">',
      '<a class="product__card--action__btn" title="Сравнить" href="compare.html">',
      '<svg class="product__card--action__btn--svg" xmlns="http://www.w3.org/2000/svg" width="19.51" height="18.443" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"></path></svg>',
      '<span class="visually-hidden">Сравнить</span>',
      '</a>',
      '</li>',
      '</ul>'
    ].join('');
  }
  function buildBadge(product) {
    return product.badge ? '<div class="product__badge"><span class="product__badge--items sale">' + escapeHtml(product.badge) + '</span></div>' : '';
  }
  function buildGridCard(product) {
    var id = escapeHtml(productId(product));
    var name = escapeHtml(product.name);
    var category = escapeHtml(product.category || 'Без категории');
    var url = escapeHtml(productLink(product));
    var description = escapeHtml(product.description || 'Описание товара будет заполнено после импорта каталога.');
    var image = escapeHtml(product.image || DEFAULT_IMAGE);
    var image2 = escapeHtml(product.image2 || product.image || DEFAULT_IMAGE);
    var oldPrice = Number(product.oldPrice) ? '<span class="price__divided"></span><span class="old__price"> ' + escapeHtml(formatPrice(product.oldPrice)) + '</span>' : '';

    return [
      '<div class="col custom-col-2 mb-30">',
      '<article class="product__card" data-catalog-id="', id, '" data-category="', category, '">',
      '<div class="product__card--thumbnail">',
      '<a class="product__card--thumbnail__link display-block" href="', url, '">',
      '<img class="product__card--thumbnail__img product__primary--img display-block" src="', image, '" alt="', name, '">',
      '<img class="product__card--thumbnail__img product__secondary--img display-block" src="', image2, '" alt="', name, '">',
      '</a>',
      buildActionButtons(product),
      buildBadge(product),
      '</div>',
      '<div class="product__card--content text-center">',
      '<span class="product__card--meta__tag">', category, '</span>',
      '<h3 class="product__card--title"><a href="', url, '">', name, '</a></h3>',
      '<div class="product__card--price"><span class="current__price">', escapeHtml(formatPrice(product.price)), '</span>', oldPrice, '</div>',
      '<a class="product__card--btn primary__btn" href="checkout.html">В корзину</a>',
      '<p class="visually-hidden">', description, '</p>',
      '</div>',
      '</article>',
      '</div>'
    ].join('');
  }
  function buildListCard(product) {
    var id = escapeHtml(productId(product));
    var name = escapeHtml(product.name);
    var category = escapeHtml(product.category || 'Без категории');
    var url = escapeHtml(productLink(product));
    var description = escapeHtml(product.description || 'Описание товара будет заполнено после импорта каталога.');
    var image = escapeHtml(product.image || DEFAULT_IMAGE);
    var image2 = escapeHtml(product.image2 || product.image || DEFAULT_IMAGE);
    var oldPrice = Number(product.oldPrice) ? '<span class="price__divided"></span><span class="old__price"> ' + escapeHtml(formatPrice(product.oldPrice)) + '</span>' : '';
    return [
      '<div class="col mb-30">',
      '<article class="product__card product__card--list d-flex" data-catalog-id="', id, '" data-category="', category, '">',
      '<div class="product__card--thumbnail product__card--list__thumbnail">',
      '<a class="product__card--thumbnail__link display-block" href="', url, '">',
      '<img class="product__card--thumbnail__img product__primary--img display-block" src="', image, '" alt="', name, '">',
      '<img class="product__card--thumbnail__img product__secondary--img display-block" src="', image2, '" alt="', name, '">',
      '</a>',
      buildActionButtons(product),
      buildBadge(product),
      '</div>',
      '<div class="product__card--content product__card--list__content">',
      '<span class="product__card--meta__tag">', category, '</span>',
      '<h3 class="product__card--title"><a href="', url, '">', name, '</a></h3>',
      '<div class="product__card--price"><span class="current__price">', escapeHtml(formatPrice(product.price)), '</span>', oldPrice, '</div>',
      '<ul class="rating product__card--list__rating d-flex"><li class="rating__list"><span class="rating__list--text">Артикул: ', escapeHtml(product.sku || '—'), '</span></li></ul>',
      '<p class="product__list--items__content--desc mb-20">', description, '</p>',
      '<a class="product__card--btn primary__btn" href="checkout.html">В корзину</a>',
      '</div>',
      '</article>',
      '</div>'
    ].join('');
  }
  function renderInto(root, products, view) {
    if (!root) return;
    var rowClass = view === 'list' ? 'row row-cols-1 mb--n30' : 'row row-cols-xl-3 row-cols-lg-2 row-cols-md-3 row-cols-2 mb--n30';
    var cardsHtml = products.map(function (product) {
      return view === 'list' ? buildListCard(product) : buildGridCard(product);
    }).join('');
    root.innerHTML = '<div class="product__section--inner product__grid--inner"><div class="' + rowClass + '">' + cardsHtml + '</div></div>';
  }
  function renderError(roots, message) {
    (roots || []).forEach(function (root) {
      var text = root.getAttribute('data-catalog-mode') === 'list' ? 'Список товаров не удалось загрузить.' : 'Каталог не удалось загрузить.';
      root.innerHTML = '<div class="product__section--inner"><div class="row"><div class="col-12"><div class="alert alert-danger text-center py-4 mb-0">' + escapeHtml(message || text) + '</div></div></div></div>';
    });
  }
  function updateCounters(products) {
    qsa('.product__showing--count').forEach(function (node) {
      var total = products.length;
      node.textContent = total ? ('Показано 1–' + total + ' из ' + total + ' товаров') : 'Товаров пока нет';
    });
  }
  function initCatalog() {
    var roots = qsa('#product_grid[data-catalog-source], #product_list[data-catalog-source]');
    if (!roots.length) return;
    var source = roots[0].getAttribute('data-catalog-source');
    if (!source) return;

    var loader = typeof window.loadCatalogProducts === 'function'
      ? function () { return window.loadCatalogProducts(source); }
      : function () {
          return fetch(source)
            .then(function (response) {
              if (!response.ok) throw new Error('Не удалось загрузить каталог');
              return response.json();
            })
            .then(function (data) {
              return Array.isArray(data) ? data : [];
            });
        };

    loader()
      .then(function (products) {
        products = Array.isArray(products) ? products : [];
        roots.forEach(function (root) {
          renderInto(root, products, root.getAttribute('data-catalog-mode') || 'grid');
        });
        ensureWishlistDelegation();
        ensureQuickviewDelegation();
        syncWishlistButtons();
        updateCounters(products);
        window.dispatchEvent(new Event('focus'));
        document.dispatchEvent(new CustomEvent('catalog:rendered', { detail: { products: products } }));
      })
      .catch(function (error) {
        console.error(error);
        renderError(roots, 'Не удалось загрузить товары. Проверь assets/data/cms-config.json или локальный assets/data/products.json.');
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCatalog);
  } else {
    initCatalog();
  }
})();
