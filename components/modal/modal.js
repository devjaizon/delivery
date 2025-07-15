export function createModal(themeColors) {
    const modal = document.createElement('div');
    modal.id = 'cart-modal';
    modal.className = 'modal';

    const modalContent = `
        <div class="modal-content rounded-lg shadow-lg p-6 w-full max-w-2xl mx-auto mt-20 relative"
            style="background-color: ${themeColors.backgroundLight};">
            <span class="close-btn absolute top-0 right-0 p-4 cursor-pointer font-bold text-2xl"
                style="color: ${themeColors.textDark};">&times;</span>
            <h2 class="text-2xl font-bold mb-4" style="color: ${themeColors.textDark};">Seu Carrinho</h2>
            <div id="cart-items" class="mb-6">
                <!-- Itens do carrinho serão inseridos aqui -->
            </div>
            <div class="text-right text-xl font-bold mb-4"
                style="color: ${themeColors.textDark};">
                Total do Carrinho: <span id="cart-modal-total">R$ 0.00</span>
            </div>
            <hr class="my-6" style="border-color: ${themeColors.border};">
            <h2 class="text-2xl font-bold mb-4" style="color: ${themeColors.textDark};">Finalizar Pedido</h2>
            <form id="checkout-form">
                <div class="mb-4">
                    <label for="observations" class="block text-sm font-bold mb-2"
                        style="color: ${themeColors.textDark};">Observações:</label>
                    <textarea id="observations" name="observations" rows="4" class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        style="color: ${themeColors.textDark}; border-color: ${themeColors.border};"></textarea>
                </div>
                <button type="submit" class="font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    style="background-color: ${themeColors.secondary}; color: ${themeColors.textLight};">
                    Continuar para Entrega
                </button>
            </form>
        </div>
    `;

    modal.innerHTML = modalContent;

    modal.querySelector('.close-btn').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    return modal;
}