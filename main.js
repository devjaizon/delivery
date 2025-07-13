import { fetchThemeColors } from './data/theme.js';
import { createHeader } from './components/header.js';
import { createMenu } from './components/menu.js';
import { createContent } from './components/content.js';
import { createFooter } from './components/footer.js';
import { createModal } from './components/modal/modal.js'; // Caminho atualizado
import { createOptionsModal } from './components/optionsModal.js';
import { createCheckoutConfirmationModal } from './components/checkoutConfirmationModal.js';
import { createNotificationModal } from './components/notificationModal.js';
import { createOrderSummaryModal } from './components/orderSummaryModal.js';
import { fetchMenuItems } from './data/items.js';
import { fetchCategories } from './data/categories.js';
import { fetchBusinessInfo } from './data/business.js'; // Importa fetchBusinessInfo
import { sendWhatsAppOrder } from './components/modal/finishPurchase.js'; // Importa a função de envio do WhatsApp
import { setupModalControls } from './components/modal/modalControls.js'; // Importa o novo módulo

document.addEventListener('DOMContentLoaded', async () => {
    const app = document.getElementById('app');
    const headerContainer = document.getElementById('header-container');
    const menuContainer = document.getElementById('menu-container');
    const footerContainer = document.getElementById('footer-container');

    // --- Estado da Aplicação ---
    let cart = [];
    let menuItems = [];
    let currentOrderDetails = {}; // Para armazenar os detalhes do pedido entre os modais

    // --- Busca os itens do menu e as cores do tema antes de renderizar componentes dependentes ---
    menuItems = await fetchMenuItems();
    const themeColors = await fetchThemeColors();
    const categories = await fetchCategories(); // Fetch categories
    const businessInfo = await fetchBusinessInfo(); // Fetch business info

    // --- Elementos DOM (independentes de menuItems) ---
    const header = createHeader(themeColors);
    const footer = createFooter(themeColors);
    const cartModal = createModal(themeColors);
    const optionsModal = createOptionsModal(themeColors);
    const checkoutConfirmationModal = createCheckoutConfirmationModal(themeColors);
    const notificationModal = createNotificationModal(themeColors);
    const orderSummaryModal = createOrderSummaryModal(themeColors);

    // --- Renderização Inicial de elementos independentes ---
    headerContainer.appendChild(header);
    footerContainer.appendChild(footer);
    app.appendChild(cartModal);
    app.appendChild(optionsModal);
    app.appendChild(checkoutConfirmationModal);
    document.body.appendChild(notificationModal);
    app.appendChild(orderSummaryModal);

    // --- Elementos DOM (dependentes de menuItems) ---
    const menu = createMenu(categories, themeColors); // Pass categories to createMenu
    let content = createContent(menuItems.filter(item => item.categories.includes('Destaques') && item.available), themeColors);

    // --- Renderização de elementos dependentes ---
    menuContainer.appendChild(menu);
    app.appendChild(content);

    const cartItemsContainer = document.getElementById('cart-items');
    const optionsModalElement = document.getElementById('options-modal');
    const optionsModalBody = document.getElementById('options-modal-body');
    const cartTotalElement = document.getElementById('cart-total');
    const cartModalTotalElement = document.getElementById('cart-modal-total');
    const checkoutConfirmationModalElement = document.getElementById('checkout-confirmation-modal');
    const notificationModalElement = document.getElementById('notification-modal');
    const notificationMessageElement = document.getElementById('notification-message');
    const orderSummaryModalElement = document.getElementById('order-summary-modal');
    const orderSummaryDetailsElement = document.getElementById('order-summary-details');

    // --- Lógica do Menu Sticky ---
    const menuSentinel = document.createElement('div');
    menuSentinel.id = 'menu-sentinel';
    menuContainer.parentNode.insertBefore(menuSentinel, menuContainer.nextSibling);

    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                menu.classList.remove('menu-fixed');
                document.body.style.paddingTop = `${header.offsetHeight}px`;
            } else {
                menu.classList.add('menu-fixed');
                document.body.style.paddingTop = `${header.offsetHeight + menu.offsetHeight}px`;
            }
        },
        { threshold: [0] }
    );
    observer.observe(menuSentinel);

    document.body.style.paddingTop = `${header.offsetHeight + menu.offsetHeight}px`;

    // --- Funções de Renderização e Filtro ---
    const renderContent = (category, themeColors) => {
        const filteredItems = menuItems.filter(item => item.categories.includes(category) && item.available);
        const newContent = createContent(filteredItems, themeColors);
        app.replaceChild(newContent, content);
        content = newContent;

        // Update active category button style
        document.querySelectorAll('.category-btn').forEach(button => {
            if (button.getAttribute('data-category') === category) {
                button.style.backgroundColor = themeColors.primary;
                button.style.color = themeColors.textLight;
                button.onmouseout = () => { button.style.backgroundColor = themeColors.primary; }; // Keep active color on mouse out
            } else {
                button.style.backgroundColor = themeColors.backgroundDark;
                button.style.color = themeColors.textLight;
                button.onmouseout = () => { button.style.backgroundColor = themeColors.backgroundDark; }; // Revert to default on mouse out
            }
        });
    };

    // --- Funções do Carrinho ---
    const updateCartTotal = () => {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalElement.textContent = `R$ ${total.toFixed(2)}`;
        return total;
    };

    const renderCart = () => {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<p style="color: ${themeColors.textDark};">Seu carrinho está vazio.</p>`;
        } else {
            cart.forEach(item => {
                const optionalsText = item.selectedOptionals.length > 0 ? `(Opcionais: ${item.selectedOptionals.join(', ')})` : '';
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'flex justify-between items-center mb-4';
                cartItemElement.innerHTML = `
                    <div class="flex items-center">
                        <img src="${item.image}" alt="${item.name}" class="w-10 h-10 mr-4 object-cover rounded">
                        <div>
                            <h4 class="font-bold" style="color: ${themeColors.textDark};">${item.name} <span class="text-sm font-normal">${optionalsText}</span></h4>
                            <p style="color: ${themeColors.textDark};">Preço: R$ ${item.price.toFixed(2)} x ${item.quantity} = R$ ${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    </div>
                    <div class="flex items-center">
                        <button class="font-bold py-1 px-2 rounded-l update-cart-quantity" data-cart-id="${item.cartId}" data-change="-1"
                            style="background-color: ${themeColors.border}; color: ${themeColors.textDark};">-</button>
                        <span class="px-4" style="color: ${themeColors.textDark};">${item.quantity}</span>
                        <button class="font-bold py-1 px-2 rounded-r update-cart-quantity" data-cart-id="${item.cartId}" data-change="1"
                            style="background-color: ${themeColors.border}; color: ${themeColors.textDark};">+</button>
                        <button class="font-bold py-1 px-2 rounded ml-4 remove-item" data-cart-id="${item.cartId}"
                            style="background-color: ${themeColors.accent}; color: ${themeColors.textLight};">Remover</button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemElement);
            });
        }
        const currentTotal = updateCartTotal();
        cartModalTotalElement.textContent = `R$ ${currentTotal.toFixed(2)}`;
    };

    const addToCart = (itemId, quantity, selectedOptionals) => {
        const itemToAdd = menuItems.find(item => String(item.id).trim() === String(itemId).trim());
        if (!itemToAdd) {
            showNotification('Erro: Item não encontrado.');
            return;
        }

        const cartId = `${itemId}_${selectedOptionals.sort().join('-')}`;
        const existingItem = cart.find(item => item.cartId === cartId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ ...itemToAdd, cartId, quantity, selectedOptionals });
        }
        renderCart();
        showNotification('Item adicionado ao carrinho!');
    };

    const removeFromCart = (cartId) => {
        cart = cart.filter(item => item.cartId !== cartId);
        renderCart();
    };

    const updateCartQuantity = (cartId, change) => {
        const itemInCart = cart.find(item => item.cartId === cartId);
        if (!itemInCart) return;

        itemInCart.quantity += change;

        if (itemInCart.quantity <= 0) {
            removeFromCart(cartId);
        } else {
            renderCart();
        }
    };

    // Função para exibir notificações
    const showNotification = (message) => {
        notificationMessageElement.textContent = message;
        notificationModalElement.classList.remove('translate-x-full');
        setTimeout(() => {
            notificationModalElement.classList.add('translate-x-full');
        }, 3000);
    };

    // --- DELEGAÇÃO DE EVENTOS ---
    document.body.addEventListener('click', (event) => {
        const target = event.target;

        // Eventos do Menu de Categorias
        if (target.classList.contains('category-btn')) {
            renderContent(target.getAttribute('data-category'), themeColors);
        }

        // Eventos para abrir o Modal de Opções
        if (target.classList.contains('open-options-modal')) {
            const itemId = target.getAttribute('data-item-id');
            const item = menuItems.find(menuItem => menuItem.id === itemId);

            if (item) {
                optionsModalBody.innerHTML = `
                    <div class="flex items-center mb-4">
                        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 mr-4 object-cover rounded">
                        <div>
                            <h3 class="text-2xl font-bold" style="color: ${themeColors.textDark};">${item.name}</h3>
                            <p class="mb-4" style="color: ${themeColors.textDark};">${item.description}</p>
                            <p class="font-bold text-xl" style="color: ${themeColors.textDark};">R$ ${item.price.toFixed(2)}</p>
                        </div>
                    </div>
                    <div class="mb-4">
                        <label for="modal-quantity-input" class="block text-sm font-bold mb-2" style="color: ${themeColors.textDark};">Quantidade:</label>
                        <div class="flex items-center">
                            <button class="font-bold py-1 px-2 rounded-l decrease-qty" style="background-color: ${themeColors.border}; color: ${themeColors.textDark};">-</button>
                            <input type="number" id="modal-quantity-input" value="1" min="1" class="w-16 text-center border-t border-b py-1"
                                style="border-color: ${themeColors.border}; color: ${themeColors.textDark};">
                            <button class="font-bold py-1 px-2 rounded-r increase-qty" style="background-color: ${themeColors.border}; color: ${themeColors.textDark};">+</button>
                        </div>
                    </div>
                    ${item.optionals && item.optionals.length > 0 ? `
                        <div class="mb-4">
                            <p class="block text-sm font-bold mb-2" style="color: ${themeColors.textDark};">Opcionais:</p>
                            ${item.optionals.map(optional => `
                                <label class="inline-flex items-center mt-2" style="color: ${themeColors.textDark};">
                                    <input type="checkbox" class="form-checkbox" name="modal-optional" value="${optional}" style="color: ${themeColors.primary};">
                                    <span class="ml-2">${optional}</span>
                                </label>
                            `).join('')}
                        </div>
                    ` : ''}
                    <button id="confirm-add-to-cart" data-item-id="${item.id}" class="font-bold py-2 px-4 rounded w-full"
                        style="background-color: ${themeColors.primary}; color: ${themeColors.textLight};">
                        Adicionar ao Carrinho
                    </button>
                `;
                optionsModalElement.style.display = 'block';
            }
        }

        // Eventos do Modal de Opções
        const quantityInput = optionsModalElement.querySelector('#modal-quantity-input');
        if (quantityInput) {
            let currentQty = parseInt(quantityInput.value);
            if (target.classList.contains('increase-qty')) {
                quantityInput.value = currentQty + 1;
            }
            if (target.classList.contains('decrease-qty') && currentQty > 1) {
                quantityInput.value = currentQty - 1;
            }
        }

        if (target.id === 'confirm-add-to-cart') {
            const itemId = target.getAttribute('data-item-id');
            const quantity = parseInt(optionsModalElement.querySelector('#modal-quantity-input').value);
            const selectedOptionals = Array.from(optionsModalElement.querySelectorAll('input[name="modal-optional"]:checked')).map(cb => cb.value);
            addToCart(itemId, quantity, selectedOptionals);
            optionsModalElement.style.display = 'none'; // Fecha o modal de opções
        }
        
        if (target.classList.contains('close-options-btn')) {
            optionsModalElement.style.display = 'none';
        }

        // Eventos do Modal do Carrinho
        if (target.classList.contains('remove-item')) {
            removeFromCart(target.getAttribute('data-cart-id'));
        }

        if (target.classList.contains('update-cart-quantity')) {
            const cartId = target.getAttribute('data-cart-id');
            const change = parseInt(target.getAttribute('data-change'));
            updateCartQuantity(cartId, change);
        }

        if (target.id === 'open-modal-btn') {
            cartModal.style.display = 'block';
        }

        if (target.classList.contains('close-btn')) {
            cartModal.style.display = 'none';
        }

        // Eventos do Modal de Confirmação de Pedido
        if (target.classList.contains('close-checkout-btn')) {
            checkoutConfirmationModalElement.style.display = 'none';
        }

        if (target.id === 'back-to-cart-btn') {
            checkoutConfirmationModalElement.style.display = 'none';
            cartModal.style.display = 'block';
        }

        // Eventos do Modal de Resumo do Pedido
        if (target.id === 'confirm-final-order-btn') {
            // Envia o pedido via WhatsApp
            sendWhatsAppOrder(currentOrderDetails, businessInfo.phone);

            showNotification('Pedido Realizado com Sucesso! Obrigado pela preferência!');
            // Limpa o carrinho e fecha todos os modais
            cart = [];
            renderCart();
            document.getElementById('final-checkout-form').reset(); // Reseta o formulário de confirmação
            document.getElementById('observations').value = ''; // Limpa observações do modal do carrinho
            orderSummaryModalElement.style.display = 'none';
        }

        if (target.id === 'back-to-checkout-btn') {
            orderSummaryModalElement.style.display = 'none';
            checkoutConfirmationModalElement.style.display = 'block';
        }

        if (target.classList.contains('close-summary-btn')) {
            orderSummaryModalElement.style.display = 'none';
        }
    });

    // Lógica para fechar modais clicando fora
    window.addEventListener('click', (event) => {
        if (event.target == cartModal) {
            cartModal.style.display = 'none';
        }
        if (event.target == optionsModalElement) {
            optionsModalElement.style.display = 'none';
        }
        if (event.target == checkoutConfirmationModalElement) {
            checkoutConfirmationModalElement.style.display = 'none';
        }
        if (event.target == orderSummaryModalElement) {
            orderSummaryModalElement.style.display = 'none';
        }
    });

    app.appendChild(cartModal);

    // Lógica para o formulário de finalização do carrinho
    const checkoutForm = cartModal.querySelector('#checkout-form');
    checkoutForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (cart.length === 0) {
            showNotification('Seu carrinho está vazio!');
            return;
        }
        // Fecha o modal do carrinho e abre o modal de confirmação
        cartModal.style.display = 'none';
        checkoutConfirmationModalElement.style.display = 'block';
    });

    // Lógica para o formulário de confirmação final
    const finalCheckoutForm = document.getElementById('final-checkout-form');
    finalCheckoutForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const customerName = document.getElementById('customer-name').value;
        const paymentMethod = document.getElementById('payment-method').value;
        const deliveryType = document.getElementById('delivery-type').value;
        const deliveryTime = document.getElementById('delivery-time').value;
        const observations = document.getElementById('observations').value;
        const address = document.getElementById('address').value;
        const reference = document.getElementById('reference').value;

        currentOrderDetails = {
            customerName,
            paymentMethod,
            deliveryType,
            deliveryTime,
            observations,
            address: deliveryType === 'domicilio' ? address : 'N/A',
            reference: deliveryType === 'domicilio' ? reference : 'N/A',
            items: cart,
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };

        const itemsSummary = currentOrderDetails.items.map(item => {
            const optionalsText = item.selectedOptionals.length > 0 ? ` (${item.selectedOptionals.join(', ')})` : '';
            return `- ${item.name}${optionalsText} x ${item.quantity} - R$ ${item.price.toFixed(2)}/un`;
        }).join('<br>');

        orderSummaryDetailsElement.innerHTML = `
            <p style="color: ${themeColors.textDark};"><strong>Nome:</strong> ${currentOrderDetails.customerName}</p>
            <p style="color: ${themeColors.textDark};"><strong>Pagamento:</strong> ${currentOrderDetails.paymentMethod}</p>
            <p style="color: ${themeColors.textDark};"><strong>Entrega:</strong> ${currentOrderDetails.deliveryType} (${currentOrderDetails.deliveryTime})</p>
            ${currentOrderDetails.deliveryType === 'domicilio' ? `<p style="color: ${themeColors.textDark};"><strong>Endereço:</strong> ${currentOrderDetails.address}</p><p style="color: ${themeColors.textDark};"><strong>Ponto de Referência:</strong> ${currentOrderDetails.reference}</p>` : ''}
            <p style="color: ${themeColors.textDark};"><strong>Observações:</strong> ${currentOrderDetails.observations || 'Nenhuma'}</p>
            <p class="mt-4 text-xl font-bold" style="color: ${themeColors.textDark};">Total: R$ ${currentOrderDetails.total.toFixed(2)}</p>
            <h3 class="font-bold mt-4 mb-2" style="color: ${themeColors.textDark};">Itens do Pedido:</h3>
            <p style="color: ${themeColors.textDark};">${itemsSummary}</p>
        `;

        checkoutConfirmationModalElement.style.display = 'none';
        orderSummaryModalElement.style.display = 'block';
    });

    // --- Inicialização ---
    renderCart();
});