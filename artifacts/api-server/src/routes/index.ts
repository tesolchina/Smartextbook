import { Router, type IRouter } from "express";
import healthRouter from "./health";
import generateLessonRouter from "./generate-lesson";
import generateMindmapRouter from "./generate-mindmap";
import chatRouter from "./chat";
import fetchUrlRouter from "./fetch-url";
import testConnectionRouter from "./test-connection";

const router: IRouter = Router();

router.use(healthRouter);
router.use(generateLessonRouter);
router.use(generateMindmapRouter);
router.use(chatRouter);
router.use(fetchUrlRouter);
router.use(testConnectionRouter);

export default router;
