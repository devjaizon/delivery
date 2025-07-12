const BUSINESS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6a5sGjwhuGckjG_TSmGCBj6yXZ8D82sBgXioOEJOj04OG5N_t1idq_lMTBInLbhZQnk7h224F5-0U/pub?gid=0&single=true&output=csv'
const PRODUCTS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6a5sGjwhuGckjG_TSmGCBj6yXZ8D82sBgXioOEJOj04OG5N_t1idq_lMTBInLbhZQnk7h224F5-0U/pub?gid=1426158823&single=true&output=csv'
const CATEGORIES_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6a5sGjwhuGckjG_TSmGCBj6yXZ8D82sBgXioOEJOj04OG5N_t1idq_lMTBInLbhZQnk7h224F5-0U/pub?gid=1322379428&single=true&output=csv'

let ORDER = []

const load = async () => {

    // console.log(CATEGORIES)
    const BUSINESS = await loadBusiness(BUSINESS_URL)
    const PRODUCTS = await loadProducts(PRODUCTS_URL)
    const CATEGORIES = await loadCategories(CATEGORIES_URL, PRODUCTS)

    // 🧠 This should be called AFTER both PRODUCTS and CATEGORIES are loaded
    const renderMenuAndProducts = () => {
        const menu = document.getElementById('categoryMenu');
        const grid = document.getElementById('productGrid');

        // Render category buttons
        menu.innerHTML = '';

        // Move "Populares" category to the top
        CATEGORIES.sort((a, b) => {
            if (a.category.toLowerCase() === 'populares') return -1;
            if (b.category.toLowerCase() === 'populares') return 1;
            return 0;
        });

        CATEGORIES.forEach(cat => {
            const btn = document.createElement('button');
            btn.textContent = `${cat.icon || ''} ${cat.category}`;
            btn.dataset.category = cat.category.toLowerCase();
            btn.onclick = () => {
                // Toggle active button style
                menu.querySelectorAll('button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter products by clicked category
                const filtered = PRODUCTS.filter(prod =>
                    prod.categories.map(c => c.toLowerCase()).includes(btn.dataset.category)
                );
                renderProducts(filtered);
            };
            menu.appendChild(btn);
        });

        // Initially show all products (or first category if preferred)
        renderProducts(PRODUCTS);

        // Automatically click "Populares" button if it exists
        const popularesBtn = Array.from(menu.children).find(
            btn => btn.dataset.category === 'populares'
        );
        if (popularesBtn) {
            popularesBtn.click();
        }
    }

    // Renders a list of product cards
    const renderProducts = (list) => {

        const grid = document.getElementById('productGrid');
        grid.innerHTML = '';

        if (list.length === 0) {
            grid.innerHTML = '<p>No products in this category.</p>';
            return;
        }

        list.forEach(prod => {
            const card = document.createElement('div');
            card.className = 'product';

            const safeName = (prod.name || 'produto-sem-nome').replace(/\s+/g, '-').toLowerCase();

            const uniqueId = `card-${safeName}`;

            // HTML básico
            let html = `
                <img src="${prod.image}" alt="${prod.name}">
                <h3>${prod.name}</h3>
                <p>${prod.description || ''}</p>
                <p class="price">R$ ${prod.price.toFixed(2).replace('.', ',')}</p>
            `;

            // 🔘 Se houver opções (como "Salada", "Molho"...), renderiza checkboxes
            if (Array.isArray(prod.options) && prod.options.length > 0) {
                html += `<div class="options"><form><fieldset><legend>Adicionais</legend>`;

                prod.options.forEach((opt, index) => {
                    const id = `${prod.name}-opt-${index}`.replace(/\s+/g, '-').toLowerCase();
                    html += `
                    <label>
                    <input type="checkbox" id="${id}" name="options" value="${opt}">
                    ${opt}
                    </label><br>
                `;
                });

                html += `</fieldset></form></div>`;
            }

            // 🔢 Contador e botão Adicionar
            html += `
                <div class="card-footer">
                <div class="quantity-control">
                    <button type="button" class="qty-btn" data-action="decrease" data-id="${uniqueId}">–</button>
                    <span id="qty-${uniqueId}" class="qty">1</span>
                    <button type="button" class="qty-btn" data-action="increase" data-id="${uniqueId}">+</button>
                </div>
                <button class="add-btn" data-id="${uniqueId}">Adicionar</button>
                </div>
            `;

            card.innerHTML = html;
            grid.appendChild(card);

            // + / - listeners
            card.querySelectorAll('.qty-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.dataset.id;
                    const span = document.getElementById(`qty-${id}`);
                    let qty = parseInt(span.textContent);
                    qty = isNaN(qty) ? 1 : qty;

                    if (btn.dataset.action === 'increase') {
                        qty++;
                    } else if (btn.dataset.action === 'decrease' && qty > 1) {
                        qty--;
                    }

                    span.textContent = qty;
                });
            });

            // Adicionar ao pedido
            card.querySelector('.add-btn').addEventListener('click', () => {
                const id = card.querySelector('.add-btn').dataset.id;
                const qty = parseInt(document.getElementById(`qty-${id}`).textContent);
                const selectedOptions = Array.from(card.querySelectorAll('input[name="options"]:checked')).map(opt => opt.value);

                const orderItem = {
                    name: prod.name,
                    image: prod.image,
                    price: prod.price,
                    count: qty,
                    options: selectedOptions.sort() // ordena para facilitar comparação
                };

                // Verifica se item igual já existe (name, image e opções)
                const existing = ORDER.find(item =>
                    item.name === orderItem.name &&
                    item.image === orderItem.image &&
                    JSON.stringify(item.options) === JSON.stringify(orderItem.options)
                );

                if (existing) {
                    existing.count += qty;
                } else {
                    ORDER.push(orderItem);
                }

                console.log(ORDER)
                updateCartTotal();
            });
        });
    }

    function updateCartTotal() {
        const total = ORDER.reduce((sum, item) => sum + item.price * item.count, 0);
        const formatted = `R$ ${total.toFixed(2).replace('.', ',')}`;

        document.getElementById(' cartTotal').textContent = formatted;
        document.getElementById('cartTotalSummary').textContent = 'Total: ' + formatted;
        document.getElementById(' checkoutTotalSummary').textContent = formatted;
    }

    function openCartModal() {
        document.getElementById('modalOverlay').style.display = 'flex';
        document.getElementById('cartView').classList.add('active');
        document.getElementById('checkoutView').classList.remove('active');
        alert('open')
        renderCartItems();
    }

    function goToCheckout() {
        document.getElementById('cartView').classList.remove('active');
        document.getElementById('checkoutView').classList.add('active');
        renderCheckoutItems();
    }

    function goBackToCart() {
        document.getElementById('checkoutView').classList.remove('active');
        document.getElementById('cartView').classList.add('active');
    }

    function renderCartItems() {
        const container = document.getElementById('cartItemsContainer');
        container.innerHTML = '';

        ORDER.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="info">
              <strong>${item.name}</strong><br>
              <small>Opções: ${item.options.join(', ') || 'Nenhuma'}</small>
            </div>
            <div class="controls">
              <button onclick="changeItemQty(${index}, -1)">–</button>
              <span>${item.count}</span>
              <button onclick="changeItemQty(${index}, 1)">+</button>
              <button onclick="removeItem(${index})">🗑️</button>
            </div>
          `;
            container.appendChild(div);
        });

        updateCartTotal(); // também atualiza o total no modal
    }

    function renderCheckoutItems() {
        const container = document.getElementById('checkoutItemsContainer');
        container.innerHTML = '';

        ORDER.forEach(item => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="info">
              <strong>${item.name}</strong><br>
              <small>Qtd: ${item.count}</small><br>
              <small>Opções: ${item.options.join(', ') || 'Nenhuma'}</small>
            </div>
          `;
            container.appendChild(div);
        });

        // preencher dados salvos
        document.getElementById('checkoutObs').value = ORDER.obs || '';
        document.getElementById('checkoutName').value = ORDER.info?.nome || '';
        document.getElementById('checkoutAddress').value = ORDER.info?.endereco || '';
        if (ORDER.info?.pagamento) {
            document.querySelector(`input[name="payment"][value="${ORDER.info.pagamento}"]`).checked = true;
        }

        updateCartTotal();
    }

    function changeItemQty(index, delta) {
        if (!ORDER[index]) return;
        ORDER[index].count += delta;

        if (ORDER[index].count <= 0) {
            ORDER.splice(index, 1);
        }

        renderCartItems();
        updateCartTotal();
    }

    function removeItem(index) {
        ORDER.splice(index, 1);
        renderCartItems();
        updateCartTotal();
    }

    function finalizeOrder() {
        ORDER.obs = document.getElementById('checkoutObs').value;
        ORDER.info = {
            nome: document.getElementById('checkoutName').value,
            endereco: document.getElementById('checkoutAddress').value,
            pagamento: (document.querySelector('input[name="payment"]:checked')?.value || '').toLowerCase()
        };

        console.log('Pedido finalizado:', ORDER);

        // aqui você pode enviar os dados via API, WhatsApp, etc.
        alert("Pedido finalizado!");
    }

    function handleModalBackgroundClick(event) {
        if (event.target.id === 'modalOverlay') {
            closeCartModal();
        }
    }

    function closeCartModal() {
        document.getElementById('modalOverlay').style.display = 'none';
    }

    document.addEventListener("DOMContentLoaded", () => {
        // Fechar modal ao clicar fora do card
        const overlay = document.getElementById('modalOverlay');
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeCartModal();
        });

        // Botão ✕
        const closeBtn = document.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeCartModal);
        }

        // Botão continuar pedido (tela 1 → 2)
        const btnContinue = document.querySelector('#cartView button');
        if (btnContinue) {
            btnContinue.addEventListener('click', goToCheckout);
        }

        // Botão voltar (tela 2 → 1)
        const btnBack = document.querySelector('#checkoutView .modal-footer button:nth-child(1)');
        if (btnBack) {
            btnBack.addEventListener('click', goBackToCart);
        }

        // Botão finalizar pedido
        const btnFinish = document.querySelector('#checkoutView .modal-footer button:nth-child(3)');
        if (btnFinish) {
            btnFinish.addEventListener('click', finalizeOrder);
        }

        const footer = document.querySelector('#cartFooter')

        if (footer) {
            footer.addEventListener('click', openCartModal())
        }
    });

    renderMenuAndProducts();
}

load()