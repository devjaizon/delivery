export function createMenu(categories, themeColors) {
    const nav = document.createElement('nav');
    nav.className = 'w-full shadow-lg';
    nav.style.backgroundColor = themeColors.backgroundDark;
    nav.style.color = themeColors.textLight;

    // Garante que "Destaques" seja a primeira, seguida pelas outras em ordem alfabética
    const destaquesCategory = categories.find(c => c.name === 'Destaques');
    const otherCategories = categories.filter(c => c.name !== 'Destaques').sort((a, b) => a.name.localeCompare(b.name));
    const orderedCategories = destaquesCategory ? [destaquesCategory, ...otherCategories] : [...otherCategories];

    let menuContent = `
        <div class="container mx-auto px-2">
            <div class="flex overflow-x-auto whitespace-nowrap py-2 space-x-2" style="-ms-overflow-style: none; scrollbar-width: none;">
                <style>
                    .flex.overflow-x-auto::-webkit-scrollbar { display: none; }
                </style>
    `;

    orderedCategories.forEach(category => {
        const isActive = category.name === 'Destaques'; // Assuming 'Destaques' is the initial active category
        const backgroundColor = isActive ? themeColors.primary : themeColors.backgroundDark;
        const textColor = isActive ? themeColors.textLight : themeColors.textLight;
        const borderColor = themeColors.border;

        menuContent += `
            <button class="category-btn px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 flex-shrink-0 flex items-center ${isActive ? 'active-category-btn' : ''}"
                style="background-color: ${backgroundColor}; color: ${textColor}; border: 1px solid ${borderColor};"
                onmouseover="this.style.backgroundColor='${isActive ? themeColors.primary : themeColors.primary}'"
                onmouseout="this.style.backgroundColor='${isActive ? themeColors.primary : themeColors.backgroundDark}'"
                data-category="${category.name}">
                ${category.icon ? `<img src="${category.icon}${encodeURIComponent(themeColors.iconColor)}" alt="${category.name}" class="w-5 h-5 mr-2">` : ''}
                ${category.name}
            </button>
        `;
    });

    menuContent += '</div></div>';
    nav.innerHTML = menuContent;
    return nav;
}