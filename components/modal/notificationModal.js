export function createNotificationModal(themeColors) {
    const notification = document.createElement('div');
    notification.id = 'notification-modal';
    notification.className = 'fixed bottom-20 right-0 px-6 py-3 rounded-lg shadow-lg transform translate-x-full transition-transform duration-500 ease-out z-50';
    notification.style.backgroundColor = themeColors.secondary;
    notification.style.color = themeColors.textLight;
    notification.innerHTML = `
        <p id="notification-message"></p>
    `;
    return notification;
}