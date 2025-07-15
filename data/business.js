export const fetchBusinessInfo = async () => {
    // ATENÇÃO: Substitua esta URL pela URL CSV da sua planilha do Google Sheets para informações do negócio.
    // A planilha deve ter as colunas: 'NAME' e 'PHONE'.
    // Exemplo:
    // NAME,PHONE
    // Meu Restaurante,(+55)11987654321
    const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6a5sGjwhuGckjG_TSmGCBj6yXZ8D82sBgXioOEJOj04OG5N_t1idq_lMTBInLbhZQnk7h224F5-0U/pub?gid=0&single=true&output=csv';

    try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL, { cache: 'no-store' });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();
        return parseBusinessCSV(csvText);
    } catch (error) {
        console.error("Erro ao buscar informações do negócio:", error);
        return {}; // Retorna um objeto vazio em caso de erro
    }
};

function parseBusinessCSV(csv) {
    const lines = csv.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) return {}; // Precisa de pelo menos cabeçalho e uma linha de dados

    const headers = lines[0].split(',').map(header => header.trim().toUpperCase());
    const businessInfo = {};

    // Assuming the business info is in the first data row
    const values = [];
    let inQuote = false;
    let currentField = '';
    const currentLine = lines[1]; // Process only the first data line

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

    headers.forEach((header, index) => {
        const value = values[index] !== undefined ? values[index] : '';
        if (header === 'NAME') {
            businessInfo.name = value;
        } else if (header === 'PHONE') {
            businessInfo.phone = value;
        } else if (header === 'LOGO') {
            businessInfo.logo = value;
        } else if (header === 'FAVICON') {
            businessInfo.favicon = value;
        } else if (header === 'IMAGE') {
            businessInfo.image = value;
        } else if (header === 'SLOGAN') {
            businessInfo.slogan = value;
        }
    });

    // console.log(businessInfo);

    return businessInfo;
}