// Very basic CSV parser that handles commas inside quotes
const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const next = line[i + 1];

        if (char === '"' && inQuotes && next === '"') {
            current += '"';
            i++; // skip next quote
        } else if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current);

    return result;
}

// loadAllSheets();
const loadBusiness = async (url) => {
    try {
        const response = await fetch(url);
        const csvText = await response.text();
        let business = {}

        const lines = csvText.trim().split('\n');

        lines.forEach(line => {
            const [key, value] = line.split(',');
            if (key && value) {
                business[key.trim()] = value.trim();
            }
        });

        if (business.name) document.title = business.name

        return business

    } catch (error) {
        console.error('Error loading business info:', error);
    }


}

const loadProducts = async (url) => {
    try {
        const response = await fetch(url);
        const csv = await response.text();

        const lines = csv.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

        products = lines.slice(1).map(line => {
            const values = parseCSVLine(line); // Support commas in quotes
            const product = {};

            headers.forEach((header, i) => {
                let value = values[i] || '';

                switch (header) {
                    case 'price':
                        value = value.replace('R$', '')       // remove currency symbol
                            .replace(/\s/g, '')      // remove all spaces
                            .replace(',', '.');      // convert comma to dot
                        value = parseFloat(value);
                        break;
                    case 'available':
                        value = value.toLowerCase() === 'true';
                        break;
                    case 'categories':
                        value = value.split(',').map(cat => cat.trim());
                        break;
                    case 'options':
                        value = value.split(',').map(opt => opt.trim());
                        break;
                    default:
                        value = value.trim();
                }

                product[header] = value;
            });

            return product;
        }).filter(product => {
            return (
                product.available === true &&
                product.name &&
                product.image
            );
        });

        return products

    } catch (err) {
        console.error('Error loading products:', err);
    }
}

const loadCategories = async (url, products) => {
    try {
        const response = await fetch(url);
        const csv = await response.text();
        const lines = csv.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

        // Get all categories actually used in PRODUCTS
        const usedCategories = new Set();
        products.forEach(product => {
            product.categories.forEach(cat => usedCategories.add(cat.toLowerCase()));
        });

        categories = lines.slice(1).map(line => {
            const values = parseCSVLine(line);
            const category = {};
            headers.forEach((header, i) => {
                category[header] = values[i]?.trim() || '';
            });
            return category;
        })
            // Only keep categories used by products
            .filter(cat => usedCategories.has(cat.category.toLowerCase()));

        return categories
    } catch (err) {
        console.error('Error loading categories:', err);
    }
}
