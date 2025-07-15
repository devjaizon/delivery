export function createHeader(themeColors, businessInfo) {
    const header = document.createElement('header');
    header.className = 'w-full bg-cover bg-center text-white';
    header.style.backgroundImage = `url(${businessInfo.image})`;
    header.style.backgroundColor = themeColors.backgroundLight; // Fallback color

    const logoHtml = businessInfo.logo ? `<div class="mx-auto mb-4 inline-block p-1 rounded-full" style="border: 2px solid ${themeColors.primary};"><img src="${businessInfo.logo}" alt="Logo ${businessInfo.name}" class="h-24 w-24 rounded-full"></div>` : '';

    const headerContent = `
    <div class="mx-auto w-full h-full px-4 py-16 text-center bg-black bg-opacity-${themeColors.heroOpacity}">
        ${logoHtml}
        <h1 class="text-5xl font-bold mb-2">${businessInfo.name}</h1>
        <p class="text-xl">${businessInfo.slogan}</p>
    </div>
    `;

    header.innerHTML = headerContent;
    return header;
}