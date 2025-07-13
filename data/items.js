export const fetchMenuItems = async () => {
    // ATENÇÃO: Substitua esta URL pela URL CSV da sua planilha do Google Sheets
    // Siga as instruções no chat para publicar sua planilha como CSV.
    const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6a5sGjwhuGckjG_TSmGCBj6yXZ8D82sBgXioOEJOj04OG5N_t1idq_lMTBInLbhZQnk7h224F5-0U/pub?gid=1426158823&single=true&output=csv'

    try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();
        return parseCSV(csvText);
    } catch (error) {
        console.error("Erro ao buscar itens do menu:", error);
        // Retorna um array vazio ou um conjunto de dados padrão em caso de erro
        return [];
    }
};

// Função auxiliar para parsear CSV para um array de objetos
function parseCSV(csv) {
    const lines = csv.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(header => header.trim().toUpperCase());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i];
        const values = [];
        let inQuote = false;
        let currentField = '';

        for (let j = 0; j < currentLine.length; j++) {
            const char = currentLine[j];
            if (char === '"' && (j === 0 || currentLine[j - 1] === ',')) { // Início de aspas
                inQuote = true;
            } else if (char === '"' && currentLine[j + 1] === '"') { // Aspas duplas escapadas
                currentField += '"';
                j++; // Pula a próxima aspas
            } else if (char === '"' && (j === currentLine.length - 1 || currentLine[j + 1] === ',')) { // Fim de aspas
                inQuote = false;
            } else if (char === ',' && !inQuote) { // Separador de campo fora de aspas
                values.push(currentField.trim());
                currentField = '';
            } else {
                currentField += char;
            }
        }
        values.push(currentField.trim()); // Adiciona o último campo

        const item = {
            id: '',
            name: '',
            image: '',
            price: 0,
            categories: [],
            description: '',
            optionals: [],
            available: false
        };

        headers.forEach((header, index) => {
            let value = values[index] !== undefined ? values[index] : '';

            if (header === 'ID') {
                item.id = value.trim();
            } else if (header === 'NAME') {
                item.name = value;
            } else if (header === 'IMAGE') {
                item.image = value;
            } else if (header === 'PRICE') {
                const cleanedValue = value.replace('R$', '').replace(',', '.').trim();
                item.price = parseFloat(cleanedValue) || 0;
            } else if (header === 'CATEGORIES') {
                item.categories = value ? value.split(',').map(s => s.trim()).filter(s => s !== '') : [];
            } else if (header === 'DESCRIPTION') {
                item.description = value;
            } else if (header === 'OPTIONALS') {
                item.optionals = value ? value.split(',').map(s => s.trim()).filter(s => s !== '') : [];
            } else if (header === 'AVAILABLE') {
                item.available = value.toLowerCase() === 'true';
            }
        });


        // Only push item if all required fields are present
        if (item.id && item.name && item.description && item.price > 0 && item.image && item.categories.length > 0) {
            // Add this line for debugging
            // console.log('Parsed Item:', item);
            data.push(item);
        }
    }

    // Add this line for debugging
    // console.log('Final Parsed Data:', data);

    return data;
}