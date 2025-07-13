export const setupModalControls = ({ cartModalElement, optionsModalElement, checkoutConfirmationModalElement, orderSummaryModalElement, cartItemsContainer, optionsModalBody, cartTotalElement, cartModalTotalElement, notificationModalElement, notificationMessageElement, menuItems, cart, currentOrderDetails, showNotification, renderCart, addToCart, removeFromCart, updateCartQuantity }) => {

    // --- Funções do Modal de Opções ---
    const openOptionsModal = (itemId) => {
        const item = menuItems.find(i => i.id === itemId);
        if (!item) return;

        if (!item.optionals || item.optionals.length === 0) {
            addToCart(itemId, 1, []);
            return;
        }

        let optionalsHtml = '';
        item.optionals.forEach((optional, index) => {
            optionalsHtml += `
                <div class="flex items-center mt-2">
                    <input type="checkbox" id="modal-optional-${item.id}-${index}" name="modal-optional" value="${optional}" class="form-checkbox h-5 w-5 text-blue-600">
                    <label for="modal-optional-${item.id}-${index}" class="ml-2 text-gray-700">${optional}</label>
                </div>
            `;
        });

        optionsModalBody.innerHTML = `
            <h3 class="font-bold text-2xl mb-4">${item.name}</h3>
            <p class="text-gray-600 mb-4">${item.description}</p>
            <h4 class="font-bold text-md mb-2">Personalize seu pedido:</h4>
            ${optionalsHtml}
            <div class="mt-6 flex justify-between items-center">
                <label for="quantity-input" class="font-bold">Quantidade:</label>
                <div class="flex items-center">
                    <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-l decrease-qty">-</button>
                    <input type="number" id="modal-quantity-input" class="w-12 text-center border-t border-b border-gray-300" value="1" min="1">
                    <button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r increase-qty">+</button>
                </div>
            </div>
            <button id="confirm-add-to-cart" class="mt-6 w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" data-item-id="${item.id}">
                Confirmar e Adicionar
            </button>
        `;
        optionsModalElement.style.display = 'block';
    };

    const closeOptionsModal = () => {
        optionsModalElement.style.display = 'none';
    };

    // --- DELEGAÇÃO DE EVENTOS ---
    document.body.addEventListener('click', (event) => {
        const target = event.target;

        // Eventos dos Cards de Produto
        if (target.classList.contains('open-options-modal')) {
            const itemId = parseInt(target.getAttribute('data-item-id'));
            openOptionsModal(itemId);
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
            const itemId = parseInt(target.getAttribute('data-item-id'));
            const quantity = parseInt(optionsModalElement.querySelector('#modal-quantity-input').value);
            const selectedOptionals = Array.from(optionsModalElement.querySelectorAll('input[name="modal-optional"]:checked')).map(cb => cb.value);
            addToCart(itemId, quantity, selectedOptionals);
            closeOptionsModal();
        }
        
        if (target.classList.contains('close-options-btn')) {
            closeOptionsModal();
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
            cartModalElement.style.display = 'block';
        }

        if (target.classList.contains('close-btn')) {
            cartModalElement.style.display = 'none';
        }

        // Eventos do Modal de Confirmação de Pedido
        if (target.classList.contains('close-checkout-btn')) {
            checkoutConfirmationModalElement.style.display = 'none';
        }

        if (target.id === 'back-to-cart-btn') {
            checkoutConfirmationModalElement.style.display = 'none';
            cartModalElement.style.display = 'block';
        }

        // Eventos do Modal de Resumo do Pedido
        if (target.id === 'confirm-final-order-btn') {
            // Aqui você enviaria o pedido para um backend real
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
        if (event.target == cartModalElement) {
            cartModalElement.style.display = 'none';
        }
        if (event.target == optionsModalElement) {
            closeOptionsModal();
        }
        if (event.target == checkoutConfirmationModalElement) {
            checkoutConfirmationModalElement.style.display = 'none';
        }
        if (event.target == orderSummaryModalElement) {
            orderSummaryModalElement.style.display = 'none';
        }
    });

    // Lógica para o formulário de finalização do carrinho
    const checkoutForm = document.getElementById('checkout-form');
    checkoutForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (cart.length === 0) {
            showNotification('Seu carrinho está vazio!');
            return;
        }
        // Fecha o modal do carrinho e abre o modal de confirmação
        cartModalElement.style.display = 'none';
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
            <p><strong>Nome:</strong> ${currentOrderDetails.customerName}</p>
            <p><strong>Pagamento:</strong> ${currentOrderDetails.paymentMethod}</p>
            <p><strong>Entrega:</strong> ${currentOrderDetails.deliveryType} (${currentOrderDetails.deliveryTime})</p>
            ${currentOrderDetails.deliveryType === 'domicilio' ? `<p><strong>Endereço:</strong> ${currentOrderDetails.address}</p><p><strong>Ponto de Referência:</strong> ${currentOrderDetails.reference}</p>` : ''}
            <p><strong>Observações:</strong> ${currentOrderDetails.observations || 'Nenhuma'}</p>
            <p class="mt-4 text-xl font-bold">Total: R$ ${currentOrderDetails.total.toFixed(2)}</p>
            <h3 class="font-bold mt-4 mb-2">Itens do Pedido:</h3>
            <p>${itemsSummary}</p>
        `;

        checkoutConfirmationModalElement.style.display = 'none';
        orderSummaryModalElement.style.display = 'block';
    });

};