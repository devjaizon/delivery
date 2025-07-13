export function createOrderSummaryModal(themeColors) {
    const modal = document.createElement('div');
    modal.id = 'order-summary-modal';
    modal.className = 'modal'; // Reutiliza o estilo de modal

    const modalContent = `
        <div class="modal-content rounded-lg shadow-lg p-6 w-full max-w-md mx-auto mt-20 relative"
            style="background-color: ${themeColors.backgroundLight};">
            <span class="close-summary-btn absolute top-0 right-0 p-4 cursor-pointer font-bold text-2xl"
                style="color: ${themeColors.textDark};">&times;</span>
            <h2 class="text-2xl font-bold mb-4" style="color: ${themeColors.textDark};">Resumo do Pedido</h2>
            <div id="order-summary-details" class="text-base leading-relaxed mb-6"
                style="color: ${themeColors.textDark};">
                <!-- Detalhes do pedido serão inseridos aqui -->
            </div>
            <div class="flex flex-col space-y-3">
                <button id="confirm-final-order-btn" class="font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    style="background-color: ${themeColors.secondary}; color: ${themeColors.textLight};">
                    Confirmar Pedido
                </button>
                <button id="back-to-checkout-btn" class="font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    style="background-color: ${themeColors.accent}; color: ${themeColors.textLight};">
                    Voltar para Detalhes
                </button>
            </div>
        </div>
    `;

    modal.innerHTML = modalContent;
    return modal;
}