(function () {
  'use strict';

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
  function formatPrice(value) {
    var num = Number(value) || 0;
    return num.toLocaleString('ru-RU') + ' ₽';
  }
  function productLink(product) {
    if (product && product.url) return product.url;
    if (product && product.sku) return 'product.html?sku=' + encodeURIComponent(product.sku);
    return 'shop.html';
  }

  var WISHLIST_KEY = 'antenna_shop_wishlist_v1';
  var COMPARE_KEY = 'antenna_shop_compare_v1';
  var COMPARE_LIMIT = 2;


  var CART_KEY = 'antenna_shop_cart_v1';

  function loadCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }
  function saveCart(list) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(list || [])); } catch (e) {}
  }
  function openMiniCart() {
    var panel = document.querySelector('.offCanvas__minicart');
    if (!panel) return;
    panel.classList.add('active');
    document.body.classList.add('offCanvas__minicart_active');
  }
  function addToCartManual(product, qty, imageSrc) {
    var list = loadCart();
    var id = itemId(product);
    var existing = list.find(function (x) { return x.id === id; });
    if (existing) {
      existing.qty = Math.max(1, Number(existing.qty || 1) + Number(qty || 1));
      existing.url = currentProductUrl(product);
      existing.img = imageSrc || existing.img || '';
    } else {
      list.push({
        id: id,
        name: product.name || 'Товар',
        price: Number(product.price) || 0,
        qty: Math.max(1, Number(qty || 1)),
        img: imageSrc || product.image || '',
        url: currentProductUrl(product)
      });
    }
    saveCart(list);
    if (window.MiniCart && typeof window.MiniCart.render === 'function') {
      window.MiniCart.render();
    }
    openMiniCart();
  }
  function bindMiniCartOpeners() {
    qsa('.minicart__open--btn').forEach(function (btn) {
      if (btn.dataset.productMiniCartBound === '1') return;
      btn.dataset.productMiniCartBound = '1';
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openMiniCart();
      });
    });
  }

  function loadList(key) {
    try {
      var raw = localStorage.getItem(key);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }
  function saveList(key, list) {
    try { localStorage.setItem(key, JSON.stringify(list || [])); } catch (e) {}
  }
  function itemId(product) {
    return String((product.name || 'Товар') + '|' + (Number(product.price) || 0) + '|' + (product.image || ''))
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }
  function syncActionButtons(product) {
    var wishlistBtn = qs('#product-add-to-wishlist');
    var compareBtn = qs('#product-add-to-compare');
    var id = itemId(product);
    if (wishlistBtn) {
      var inWishlist = loadList(WISHLIST_KEY).some(function (item) { return item.id === id; });
      wishlistBtn.classList.toggle('is-in-wishlist', inWishlist);
    }
    if (compareBtn) {
      var inCompare = loadList(COMPARE_KEY).some(function (item) { return item.id === id; });
      compareBtn.classList.toggle('is-in-compare', inCompare);
    }
  }
  function bindWishlistButton(product) {
    var btn = qs('#product-add-to-wishlist');
    if (!btn || btn.dataset.boundWishlist === '1') return;
    btn.dataset.boundWishlist = '1';
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopPropagation();
      var list = loadList(WISHLIST_KEY);
      var item = {
        id: itemId(product),
        name: product.name || 'Товар',
        price: Number(product.price) || 0,
        img: product.image || '',
        category: product.category || '',
        url: currentProductUrl(product)
      };
      var exists = list.some(function (x) { return x.id === item.id; });
      list = exists ? list.filter(function (x) { return x.id !== item.id; }) : list.concat(item);
      saveList(WISHLIST_KEY, list);
      syncActionButtons(product);
      if (window.dispatchEvent) window.dispatchEvent(new Event('focus'));
    });
  }
  function bindCompareButton(product) {
    var btn = qs('#product-add-to-compare');
    if (!btn || btn.dataset.boundCompare === '1') return;
    btn.dataset.boundCompare = '1';
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var list = loadList(COMPARE_KEY);
      var item = {
        id: itemId(product),
        name: product.name || 'Товар',
        price: Number(product.price) || 0,
        img: product.image || '',
        category: product.category || '',
        link: currentProductUrl(product)
      };
      var idx = list.findIndex(function (x) { return x.id === item.id; });
      if (idx !== -1) {
        list.splice(idx, 1);
      } else {
        if (list.length >= COMPARE_LIMIT) list.shift();
        list.push(item);
      }
      saveList(COMPARE_KEY, list);
      syncActionButtons(product);
      if (window.dispatchEvent) window.dispatchEvent(new Event('focus'));
    });
  }

  function currentProductUrl(product) {
    return 'product.html?sku=' + encodeURIComponent(product.sku || '');
  }
  function getSku() {
    var params = new URLSearchParams(window.location.search);
    return (params.get('sku') || '').trim();
  }
  function splitSpecs(product) {
    var specs = [];
    if (Array.isArray(product.specs)) return product.specs;
    var source = product.specs || product.characteristics || '';
    String(source || '').split(/[;\n]+/).forEach(function (part) {
      var item = part.trim();
      if (!item) return;
      var chunks = item.split(':');
      if (chunks.length > 1) {
        specs.push({ label: chunks.shift().trim(), value: chunks.join(':').trim() });
      } else {
        specs.push({ label: 'Параметр', value: item });
      }
    });
    if (!specs.length) {
      specs.push({ label: 'Категория', value: product.category || 'Не указана' });
      specs.push({ label: 'Артикул', value: product.sku || '—' });
      if (product.model) specs.push({ label: 'Модель', value: product.model });
    }
    return specs;
  }
  function productImages(product) {
    var images = [];
    [product.image, product.image2, product.image3].forEach(function (src) {
      if (!src || images.indexOf(src) !== -1) return;
      images.push(src);
    });
    return images.length ? images : ['assets/img/product/product1.webp'];
  }
  function renderThumbs(images) {
    var wrap = qs('#product-gallery-thumbs');
    var mainImage = qs('#product-main-image');
    if (!wrap || !mainImage) return;
    wrap.innerHTML = images.map(function (src, index) {
      return '<button class="dynamic-product__thumb' + (index === 0 ? ' is-active' : '') + '" type="button" data-image-src="' + escapeHtml(src) + '"><img src="' + escapeHtml(src) + '" alt="Миниатюра"></button>';
    }).join('');
    wrap.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-image-src]');
      if (!btn) return;
      qsa('.dynamic-product__thumb', wrap).forEach(function (node) { node.classList.remove('is-active'); });
      btn.classList.add('is-active');
      mainImage.src = btn.getAttribute('data-image-src');
    });
  }
  function renderSpecs(specs) {
    var root = qs('#product-specs');
    if (!root) return;
    root.innerHTML = specs.map(function (item) {
      return '<div class="dynamic-product__spec"><span class="dynamic-product__meta-label">' + escapeHtml(item.label) + '</span><span class="dynamic-product__meta-value">' + escapeHtml(item.value) + '</span></div>';
    }).join('');
  }
  function renderRelated(products, current) {
    var root = qs('#related-products');
    if (!root) return;
    var related = products.filter(function (item) {
      return item.sku !== current.sku && item.category === current.category;
    }).slice(0, 3);
    if (!related.length) {
      related = products.filter(function (item) { return item.sku !== current.sku; }).slice(0, 3);
    }
    root.innerHTML = related.map(function (product) {
      var url = productLink(product);
      var oldPrice = Number(product.oldPrice) ? '<span class="price__divided"></span><span class="old__price"> ' + escapeHtml(formatPrice(product.oldPrice)) + '</span>' : '';
      return '<div class="col mb-30">' +
        '<article class="product__card" data-category="' + escapeHtml(product.category || '') + '">' +
        '<div class="product__card--thumbnail">' +
        '<a class="product__card--thumbnail__link display-block" href="' + escapeHtml(url) + '">' +
        '<img class="product__card--thumbnail__img product__primary--img display-block" src="' + escapeHtml(product.image || 'assets/img/product/product1.webp') + '" alt="' + escapeHtml(product.name) + '">' +
        '<img class="product__card--thumbnail__img product__secondary--img display-block" src="' + escapeHtml(product.image2 || product.image || 'assets/img/product/product1.webp') + '" alt="' + escapeHtml(product.name) + '">' +
        '</a>' +
        '<ul class="product__card--action d-flex align-items-center justify-content-center">' +
        '<li class="product__card--action__list"><a class="product__card--action__btn" title="В избранное" href="wishlist.html"><svg class="product__card--action__btn--svg" xmlns="http://www.w3.org/2000/svg" width="25.51" height="22.443" viewBox="0 0 512 512"><path d="M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0018 0c96.26-65.34 184.09-143.09 183-252.42-.54-52.67-42.32-96.81-95.08-96.81z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path></svg><span class="visually-hidden">В избранное</span></a></li>' +
        '<li class="product__card--action__list"><a class="product__card--action__btn" title="Сравнить" href="compare.html"><svg class="product__card--action__btn--svg" xmlns="http://www.w3.org/2000/svg" width="19.51" height="18.443" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"></path></svg><span class="visually-hidden">Сравнить</span></a></li>' +
        '</ul>' +
        (product.badge ? '<div class="product__badge"><span class="product__badge--items sale">' + escapeHtml(product.badge) + '</span></div>' : '') +
        '</div>' +
        '<div class="product__card--content text-center">' +
        '<span class="product__card--meta__tag">' + escapeHtml(product.category || 'Каталог') + '</span>' +
        '<h3 class="product__card--title"><a href="' + escapeHtml(url) + '">' + escapeHtml(product.name) + '</a></h3>' +
        '<div class="product__card--price"><span class="current__price">' + escapeHtml(formatPrice(product.price)) + '</span>' + oldPrice + '</div>' +
        '<a class="product__card--btn primary__btn" href="checkout.html">В корзину</a>' +
        '</div></article></div>';
    }).join('');
    if (window.dispatchEvent) window.dispatchEvent(new Event('focus'));
  }

  function bindCartButton(product) {
    var btn = qs('#product-add-to-cart');
    var qtyInput = qs('#product-qty');
    var mainImage = qs('#product-main-image');
    if (!btn || btn.dataset.boundCart === '1') return;
    btn.dataset.boundCart = '1';
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var qty = Math.max(1, parseInt(qtyInput && qtyInput.value ? qtyInput.value : '1', 10) || 1);
      addToCartManual(product, qty, mainImage ? (mainImage.getAttribute('src') || '') : '');
    });
  }

  function showState(message, isError) {
    var state = qs('#product-page-state');
    var content = qs('#product-page-content');
    if (!state || !content) return;
    state.className = 'dynamic-product__empty' + (isError ? ' border border-danger' : '');
    state.textContent = message;
    state.classList.remove('d-none');
    content.classList.add('d-none');
  }
  function showContent() {
    var state = qs('#product-page-state');
    var content = qs('#product-page-content');
    if (!state || !content) return;
    state.classList.add('d-none');
    content.classList.remove('d-none');
  }
  function renderProduct(product, products) {
    var images = productImages(product);
    var title = product.name || 'Товар';
    var currentUrl = currentProductUrl(product);
    document.title = title + ' | Усилители связи';
    qs('#product-breadcrumb-current').textContent = title;
    var titleLink = qs('#product-title-link');
    if (titleLink) { titleLink.textContent = title; titleLink.setAttribute('href', currentUrl); }
    qs('#product-price').textContent = formatPrice(product.price);
    var oldPrice = qs('#product-old-price');
    if (oldPrice) {
      oldPrice.textContent = Number(product.oldPrice) ? formatPrice(product.oldPrice) : '';
      oldPrice.style.display = Number(product.oldPrice) ? '' : 'none';
    }
    qs('#product-description').textContent = product.description || product.about || 'Описание товара будет добавлено после обновления каталога.';
    qs('#product-about').textContent = product.about || product.description || 'Подробное описание товара пока не заполнено.';
    qs('#product-sku').textContent = product.sku || '—';
    qs('#product-category').textContent = product.category || '—';
    qs('#product-model').textContent = product.model || product.slug || '—';
    qs('#product-stock').textContent = product.stock ? String(product.stock) + ' шт.' : (product.badge || 'По запросу');
    qs('#product-badge').textContent = product.badge || 'В наличии';
    var mainImage = qs('#product-main-image');
    mainImage.src = images[0];
    mainImage.alt = title;
    renderThumbs(images);
    renderSpecs(splitSpecs(product));
    renderRelated(products, product);
    bindMiniCartOpeners();
    bindCartButton(product);
    bindWishlistButton(product);
    bindCompareButton(product);
    syncActionButtons(product);
    showContent();
    if (window.dispatchEvent) window.dispatchEvent(new Event('focus'));
  }

  var sku = getSku();
  if (!sku) {
    showState('Не указан артикул товара в ссылке.', true);
    return;
  }

  fetch('assets/data/products.json')
    .then(function (response) {
      if (!response.ok) throw new Error('Не удалось загрузить каталог товаров');
      return response.json();
    })
    .then(function (products) {
      products = Array.isArray(products) ? products : [];
      var product = products.find(function (item) { return String(item.sku || '').trim() === sku; });
      if (!product) {
        showState('Товар с артикулом ' + sku + ' не найден в каталоге.', true);
        return;
      }
      renderProduct(product, products);
    })
    .catch(function () {
      showState('Не удалось загрузить данные товара. Проверь файл assets/data/products.json.', true);
    });
})();
