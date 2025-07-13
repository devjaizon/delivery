export function createHeader(themeColors) {
    const header = document.createElement('header');
    header.className = 'fixed top-0 left-0 right-0 shadow w-full z-50';
    header.style.backgroundColor = themeColors.backgroundLight;

    const headerContent = `
        <div class="container mx-auto px-4 py-6">
            <h1 class="text-3xl font-bold" style="color: ${themeColors.textDark};">Restaurante Delícia</h1>
            <p style="color: ${themeColors.textDark};">O melhor da cidade</p>
        </div>
    `;

    header.innerHTML = headerContent;
    return header;
}