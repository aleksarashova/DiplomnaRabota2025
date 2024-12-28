import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const fileFilter = (req: any, file: any, cb: any) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPEG, PNG, and JPG files are allowed."), false);
    }
};

const createStorage = (folderName: string) =>
    multer.diskStorage({
        destination: path.join(__dirname, `../../uploads/${folderName}`),
        filename: (req, file, cb) => {
            const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
            cb(null, uniqueName);
        },
    });

export const uploadRecipeImage = multer({
    storage: createStorage("recipes"),
    fileFilter,
});

export const uploadProfileImage = multer({
    storage: createStorage("profile"),
    fileFilter,
});