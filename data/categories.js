export const fetchCategories = async () => {
    // ATENÇÃO: Substitua esta URL pela URL CSV da sua planilha do Google Sheets para categorias.
    // A planilha deve ter as colunas: 'ID', 'NAME', 'DESCRIPTION', 'IMAGE', 'ICON'.
    const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6a5sGjwhuGckjG_TSmGCBj6yXZ8D82sBgXioOEJOj04OG5N_t1idq_lMTBInLbhZQnk7h224F5-0U/pub?gid=1322379428&single=true&output=csv';

    try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();
        return parseCategoriesCSV(csvText);
    } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        return []; // Retorna um array vazio em caso de erro
    }
};

function parseCategoriesCSV(csv) {
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
            if (char === '"' && (j === 0 || currentLine[j - 1] === ',')) {
                inQuote = true;
            } else if (char === '"' && currentLine[j + 1] === '"') {
                currentField += '"';
                j++;
            } else if (char === '"' && (j === currentLine.length - 1 || currentLine[j + 1] === ',')) {
                inQuote = false;
            } else if (char === ',' && !inQuote) {
                values.push(currentField.trim());
                currentField = '';
            } else {
                currentField += char;
            }
        }
        values.push(currentField.trim());

        const category = {
            id: '',
            name: '',
            description: '',
            image: '',
            icon: ''
        };

        headers.forEach((header, index) => {
            let value = values[index] !== undefined ? values[index] : '';

            if (header === 'ID') {
                category.id = value.trim();
            } else if (header === 'NAME') {
                category.name = value;
            } else if (header === 'DESCRIPTION') {
                category.description = value;
            } else if (header === 'ICON') {
                category.icon = value;
            } else if (header === 'IMAGE') {
                category.image = value;
            }
        });

        // Only push category if all required fields are present
        if (category.id && category.name && category.description) {
            data.push(category);
        }
    }

    // console.log(data);


    return data;
}