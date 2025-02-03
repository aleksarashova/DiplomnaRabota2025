import express, {Router} from "express";

import {addNewCategory, deleteCategory, getAllCategories} from "../controllers/CategoryController";
import {checkAuthentication} from "../middlewares/UserMiddleware";
import {checkUniquenessCategory} from "../middlewares/CategoryMiddleware";

const router: Router = express.Router();

router.get("/get-all", checkAuthentication, getAllCategories);
router.get("/get-all-sidebar", getAllCategories);

router.post("/add-new", checkAuthentication, checkUniquenessCategory, addNewCategory);

router.delete("/delete-category", checkAuthentication, deleteCategory);

export default router;