import { Router, type IRouter } from "express";
import healthRouter from "./health";
import generateLessonRouter from "./generate-lesson";
import chatRouter from "./chat";
import fetchUrlRouter from "./fetch-url";

const router: IRouter = Router();

router.use(healthRouter);
router.use(generateLessonRouter);
router.use(chatRouter);
router.use(fetchUrlRouter);

export default router;
