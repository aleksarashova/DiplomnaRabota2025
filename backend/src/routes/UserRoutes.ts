import express, { Router } from "express";

import dotenv from 'dotenv';

dotenv.config();

const router: Router = express.Router();

router.post("/register");
router.post("/login");
router.post("/update-profile");
router.post("/delete-profile");

export default router;