export function sendWhatsAppOrder(orderDetails, businessPhone) {
    if (!businessPhone) {
        console.error("Número de telefone do negócio não encontrado.");
        alert("Erro: Não foi possível encontrar o número de telefone do negócio para enviar o pedido.");
        return;
    }

    const itemsSummary = orderDetails.items.map(item => {
        const optionalsText = item.selectedOptionals.length > 0 ? ` (${item.selectedOptionals.join(', ')})` : '';
        return `- ${item.name}${optionalsText} x ${item.quantity} - R$ ${item.price.toFixed(2)}/un`;
    }).join('\n');

    const message = `*NOVO PEDIDO - ${orderDetails.customerName}*\n\n` +
                    `*Detalhes do Pedido:*\n` +
                    `Nome: ${orderDetails.customerName}\n` +
                    `Pagamento: ${orderDetails.paymentMethod}\n` +
                    `Entrega: ${orderDetails.deliveryType} (${orderDetails.deliveryTime})\n` +
                    `${orderDetails.deliveryType === 'domicilio' ? `Endereço: ${orderDetails.address}\n` : ''}` +
                    `${orderDetails.deliveryType === 'domicilio' ? `Ponto de Referência: ${orderDetails.reference}\n` : ''}` +
                    `Observações: ${orderDetails.observations || 'Nenhuma'}\n\n` +
                    `*Itens do Pedido:*\n` +
                    `${itemsSummary}\n\n` +
                    `*Total: R$ ${orderDetails.total.toFixed(2)}*\n\n` +
                    `_Por favor, confirme o pedido com o cliente._`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${businessPhone}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');

    alert("Seu pedido será enviado via WhatsApp. Por favor, confirme o envio na nova aba que será aberta.");
}

