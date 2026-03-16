import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../../db.json');

export const readDB = async () => {
    try {
        console.log(`Attempting to read database from: ${DB_PATH}`);
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading database:', error);
        return { tasks: [], users: [], groups: [] };
    }
};

export const writeDB = async (data) => {
    try {
        await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing database:', error);
    }
};
