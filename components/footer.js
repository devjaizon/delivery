export function createFooter(themeColors) {
    const footer = document.createElement('footer');
    // Classes para fixar o footer na base da tela
    footer.className = 'fixed bottom-0 left-0 right-0 p-4 shadow-lg';
    footer.style.backgroundColor = themeColors.backgroundDark;
    footer.style.color = themeColors.textLight;

    const footerContent = `
        <div class="container mx-auto flex justify-between items-center">
            <div class="text-left">
                <p class="font-bold text-lg">Total do Pedido:</p>
                <p id="cart-total" class="text-2xl font-bold">R$ 0.00</p>
            </div>
            <button id="open-modal-btn" class="font-bold py-3 px-6 rounded-lg"
                style="background-color: ${themeColors.primary}; color: ${themeColors.textLight};">
                Ver Carrinho
            </button>
        </div>
    `;

    footer.innerHTML = footerContent;

    return footer;
}