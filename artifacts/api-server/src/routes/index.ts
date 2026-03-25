import { Router, type IRouter } from "express";
import healthRouter from "./health";
import lessonsRouter from "./lessons";
import fetchUrlRouter from "./fetch-url";

const router: IRouter = Router();

router.use(healthRouter);
router.use(lessonsRouter);
router.use(fetchUrlRouter);

export default router;
