export function createCheckoutConfirmationModal(themeColors) {
    const modal = document.createElement('div');
    modal.id = 'checkout-confirmation-modal';
    modal.className = 'modal'; // Reutiliza o estilo de modal

    const modalContent = `
        <div class="modal-content rounded-lg shadow-lg p-6 w-full max-w-md mx-auto mt-20 relative"
            style="background-color: ${themeColors.backgroundLight};">
            <span class="close-checkout-btn absolute top-0 right-0 p-4 cursor-pointer font-bold text-2xl"
                style="color: ${themeColors.textDark};">&times;</span>
            <h2 class="text-2xl font-bold mb-4" style="color: ${themeColors.textDark};">Confirmar Pedido</h2>
            <form id="final-checkout-form">
                <div class="mb-4">
                    <label for="customer-name" class="block text-sm font-bold mb-2" style="color: ${themeColors.textDark};">Seu Nome:</label>
                    <input type="text" id="customer-name" name="customer-name" class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        style="color: ${themeColors.textDark}; border-color: ${themeColors.border};" required>
                </div>

                <div class="mb-4">
                    <label for="delivery-type" class="block text-sm font-bold mb-2" style="color: ${themeColors.textDark};">Tipo de Entrega:</label>
                    <select id="delivery-type" name="delivery-type" class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        style="color: ${themeColors.textDark}; border-color: ${themeColors.border};" required>
                        <option value="">Selecione...</option>
                        <option value="domicilio">Entrega em Domicílio</option>
                        <option value="retirada">Retirada no Local</option>
                    </select>
                </div>

                <div id="address-fields" class="hidden">
                    <div class="mb-4">
                        <label for="address" class="block text-sm font-bold mb-2" style="color: ${themeColors.textDark};">Endereço:</label>
                        <input type="text" id="address" name="address" class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            style="color: ${themeColors.textDark}; border-color: ${themeColors.border};">
                    </div>
                    <div class="mb-4">
                        <label for="reference" class="block text-sm font-bold mb-2" style="color: ${themeColors.textDark};">Ponto de Referência:</label>
                        <input type="text" id="reference" name="reference" class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            style="color: ${themeColors.textDark}; border-color: ${themeColors.border};">
                    </div>
                </div>

                <div class="mb-4">
                    <label for="payment-method" class="block text-sm font-bold mb-2" style="color: ${themeColors.textDark};">Método de Pagamento:</label>
                    <select id="payment-method" name="payment-method" class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        style="color: ${themeColors.textDark}; border-color: ${themeColors.border};" required>
                        <option value="">Selecione...</option>
                        <option value="dinheiro">Dinheiro</option>
                        <option value="pix">Pix</option>
                        <option value="cartao">Cartão</option>
                    </select>
                </div>

                <div class="mb-6">
                    <label for="delivery-time" class="block text-sm font-bold mb-2" style="color: ${themeColors.textDark};">Horário de Entrega:</label>
                    <select id="delivery-time" name="delivery-time" class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        style="color: ${themeColors.textDark}; border-color: ${themeColors.border};" required>
                        <option value="">Selecione...</option>
                        <option value="agora">O mais rápido possível</option>
                        <option value="agendar">Agendar</option>
                    </select>
                </div>

                <button type="submit" class="font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    style="background-color: ${themeColors.secondary}; color: ${themeColors.textLight};">
                    Revisar Pedido
                </button>
                <button type="button" id="back-to-cart-btn" class="mt-3 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    style="background-color: ${themeColors.accent}; color: ${themeColors.textLight};">
                    Voltar ao Carrinho
                </button>
            </form>
        </div>
    `;

    modal.innerHTML = modalContent;

    // Lógica para mostrar/esconder campos de endereço e controlar métodos de pagamento
    modal.addEventListener('change', (event) => {
        if (event.target.id === 'delivery-type') {
            const deliveryType = event.target.value;
            const addressFields = modal.querySelector('#address-fields');
            const paymentMethodSelect = modal.querySelector('#payment-method');
            const pixOption = paymentMethodSelect.querySelector('option[value="pix"]');
            const dinheiroOption = paymentMethodSelect.querySelector('option[value="dinheiro"]');
            const cartaoOption = paymentMethodSelect.querySelector('option[value="cartao"]');

            if (deliveryType === 'domicilio') {
                addressFields.classList.remove('hidden');
                paymentMethodSelect.value = ''; // Reseta a seleção de pagamento
                dinheiroOption.disabled = false;
                cartaoOption.disabled = false;
                pixOption.disabled = false;
            } else if (deliveryType === 'retirada') {
                addressFields.classList.add('hidden');
                paymentMethodSelect.value = 'pix'; // Seleciona Pix automaticamente
                dinheiroOption.disabled = true;
                cartaoOption.disabled = true;
                pixOption.disabled = false;
            } else {
                addressFields.classList.add('hidden');
                paymentMethodSelect.value = '';
                dinheiroOption.disabled = false;
                cartaoOption.disabled = false;
                pixOption.disabled = false;
            }
        }
    });

    return modal;
}