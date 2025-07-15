export const createContent = (items, themeColors, category) => {
    const main = document.createElement('main');
    main.id = 'menu-content';
    main.className = 'py-6';

    let categoryHeader = '';
    if (category && category.image) {
        categoryHeader = `
            <div class="relative w-full h-48 bg-cover bg-center rounded-lg overflow-hidden mb-6" style="background-image: url('${category.image}');">
                <div class="absolute inset-0 bg-black bg-opacity-${category.opacity} backdrop-blur-sm flex items-center justify-center">
                    <div class="text-center text-white p-4">
                        <h2 class="text-4xl font-bold">${category.name}</h2>
                        <p class="text-lg mt-2">${category.description}</p>
                    </div>
                </div>
            </div>
        `;
    }

    if (items.length === 0) {
        main.innerHTML = `${categoryHeader}<p class="text-center" style="color: ${themeColors.textDark};">Nenhum item encontrado nesta categoria.</p>`;
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
    main.innerHTML = categoryHeader + content;

    return main;
}