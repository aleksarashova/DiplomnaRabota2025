import express, {Router} from "express";

import {addNewCategory, deleteCategory, getAllCategories} from "../controllers/CategoryController";
import {checkAuthentication} from "../middlewares/UserMiddleware";

const router: Router = express.Router();

router.get("/get-all", checkAuthentication, getAllCategories);
router.post("/add-new", checkAuthentication, addNewCategory);
router.post("/delete-category", checkAuthentication, deleteCategory);

export default router;