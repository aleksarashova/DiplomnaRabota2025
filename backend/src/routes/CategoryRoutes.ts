import express, {Router} from "express";

import { getAllCategories } from "../controllers/CategoryController";

const router: Router = express.Router();

router.get("/get-all", getAllCategories);

export default router;