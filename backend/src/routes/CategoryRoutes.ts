import express, {Router} from "express";

import {addNewCategory, getAllCategories} from "../controllers/CategoryController";
import {checkAuthentication} from "../middlewares/UserMiddleware";

const router: Router = express.Router();

router.get("/get-all", checkAuthentication, getAllCategories);
router.post("/add-new", checkAuthentication, addNewCategory);

export default router;