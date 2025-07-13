export function createOptionsModal(themeColors) {
    const modal = document.createElement('div');
    modal.id = 'options-modal';
    modal.className = 'modal'; // Reutiliza o estilo de modal que já temos

    const modalContent = `
        <div class="modal-content rounded-lg shadow-lg p-6 w-full max-w-lg mx-auto mt-20 relative"
            style="background-color: ${themeColors.backgroundLight};">
            <span class="close-options-btn absolute top-0 right-0 p-4 cursor-pointer font-bold text-2xl"
                style="color: ${themeColors.textDark};">&times;</span>
            <div id="options-modal-body"></div>
        </div>
    `;

    modal.innerHTML = modalContent;
    return modal;
}