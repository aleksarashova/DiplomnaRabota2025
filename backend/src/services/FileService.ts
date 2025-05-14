import { promises as fs } from "node:fs";

export const deleteFile = async (filePath: string): Promise<void> => {
    try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        console.log(`Deleted file: ${filePath}`);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            console.warn(`File not found: ${filePath}`);
        } else {
            console.error(`Error deleting file at ${filePath}:`, error);
        }
    }
}

