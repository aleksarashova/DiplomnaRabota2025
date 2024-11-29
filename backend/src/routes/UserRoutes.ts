import express, { Router } from "express";
import { register } from "../controllers/UserController";

const router: Router = express.Router();

router.post("/register", register);
router.post("/login");
router.post("/update-profile");
router.post("/delete-profile");

export default router;