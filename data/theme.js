export const fetchThemeColors = async () => {
    // ATENÇÃO: Substitua esta URL pela URL CSV da sua planilha do Google Sheets para as cores do tema.
    // A planilha deve ter as colunas nomeadas com as chaves das cores (ex: primary, secondary, etc.)
    // e os valores na primeira linha de dados.
    // Exemplo:
    // primary,secondary,accent,textDark,textLight,backgroundLight,backgroundDark,border
    // "rgb(59, 130, 246)","rgb(16, 185, 129)","rgb(239, 68, 68)","rgb(17, 24, 39)","rgb(255, 255, 255)","rgb(249, 250, 251)","rgb(31, 41, 55)","rgb(209, 213, 219)"
    const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6a5sGjwhuGckjG_TSmGCBj6yXZ8D82sBgXioOEJOj04OG5N_t1idq_lMTBInLbhZQnk7h224F5-0U/pub?gid=1367384307&single=true&output=csv';

    try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();
        return parseThemeCSV(csvText);
    } catch (error) {
        console.error("Erro ao buscar cores do tema:", error);
        // Retorna um objeto padrão em caso de erro para evitar quebrar a aplicação
        return {
            primary: 'rgb(59, 130, 246)',
            secondary: 'rgb(16, 185, 129)',
            accent: 'rgb(239, 68, 68)',
            textDark: 'rgb(17, 24, 39)',
            textLight: 'rgb(255, 255, 255)',
            backgroundLight: 'rgb(249, 250, 251)',
            backgroundDark: 'rgb(31, 41, 55)',
            border: 'rgba(209, 213, 219, 0.048)',
            iconColor: 'rgba(255, 255, 255, 0.164)' // Default icon color
        };
    }
};

function parseThemeCSV(csv) {
    const lines = csv.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) return {}; // Precisa de pelo menos cabeçalho e uma linha de dados

    const parseLine = (line) => {
        const values = [];
        let inQuote = false;
        let currentField = '';

        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"' && (j === 0 || line[j - 1] === ',')) { // Início de aspas
                inQuote = true;
            } else if (char === '"' && line[j + 1] === '"') { // Aspas duplas escapadas
                currentField += '"';
                j++; // Pula a próxima aspas
            } else if (char === '"' && (j === line.length - 1 || line[j + 1] === ',')) { // Fim de aspas
                inQuote = false;
            } else if (char === ',' && !inQuote) { // Separador de campo fora de aspas
                values.push(currentField.trim());
                currentField = '';
            } else {
                currentField += char;
            }
        }
        values.push(currentField.trim()); // Adiciona o último campo
        return values;
    };

    const headers = parseLine(lines[0]).map(header => header.trim()); // Headers are the keys
    const values = parseLine(lines[1]).map(value => value.trim()); // Values are the first data row

    const themeColors = {};
    headers.forEach((header, index) => {
        if (header && values[index]) {
            themeColors[header] = values[index];
        }
    });

    return themeColors;
}
