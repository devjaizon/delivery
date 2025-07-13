export const createContent = (items, themeColors) => {
    const main = document.createElement('main');
    main.id = 'menu-content'; // Adiciona um ID para facilitar a delegação de eventos
    main.className = 'py-6';

    if (items.length === 0) {
        main.innerHTML = `<p class="text-center" style="color: ${themeColors.textDark};">Nenhum item encontrado nesta categoria.</p>`;
        return main;
    }

    let content = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">';

    items.forEach(item => {
        content += `
            <div class="rounded-lg shadow-md overflow-hidden flex flex-col" style="background-color: ${themeColors.backgroundLight};">
                <img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover">
                <div class="p-4 flex flex-col flex-grow">
                    <h3 class="font-bold text-xl mb-2" style="color: ${themeColors.textDark};">${item.name}</h3>
                    <p class="text-base flex-grow" style="color: ${themeColors.textDark};">${item.description}</p>
                    <div class="mt-4 flex justify-between items-center">
                        <span class="font-bold text-lg" style="color: ${themeColors.textDark};">R$ ${item.price.toFixed(2)}</span>
                        <button class="font-bold py-2 px-4 rounded open-options-modal" data-item-id="${item.id}"
                            style="background-color: ${themeColors.primary}; color: ${themeColors.textLight};">
                            Adicionar
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    content += '</div>';
    main.innerHTML = content;

    return main;
}