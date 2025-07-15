import { createContent } from '../components/content.js';

export const updateContent = (category, menuItems, themeColors, app, content) => {
    const filteredItems = menuItems.filter(item => item.categories.includes(category.name) && item.available);
    const newContent = createContent(filteredItems, themeColors, category);
    app.replaceChild(newContent, content);
    content = newContent;

    // Update active category button style
    document.querySelectorAll('.category-btn').forEach(button => {
        if (button.getAttribute('data-category') === category.name) {
            button.style.backgroundColor = themeColors.primary;
            button.style.color = themeColors.textLight;
            button.onmouseout = () => { button.style.backgroundColor = themeColors.primary; }; // Keep active color on mouse out
        } else {
            button.style.backgroundColor = themeColors.backgroundDark;
            button.style.color = themeColors.textLight;
            button.onmouseout = () => { button.style.backgroundColor = themeColors.backgroundDark; }; // Revert to default on mouse out
        }
    });

    return content;
};