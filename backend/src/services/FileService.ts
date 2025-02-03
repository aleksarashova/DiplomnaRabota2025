import fs from "node:fs";

export const deleteFile = async (filePath: string) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Deleted file: ${filePath}`);
        } else {
            console.warn(`File not found: ${filePath}`);
        }
    } catch (error) {
        console.error(`Error deleting file at ${filePath}:`, error);
    }
}

