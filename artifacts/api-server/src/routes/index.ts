import { Router, type IRouter } from "express";
import healthRouter from "./health";
import generateLessonRouter from "./generate-lesson";
import generateMindmapRouter from "./generate-mindmap";
import generateSlidesRouter from "./generate-slides";
import chatRouter from "./chat";
import fetchUrlRouter from "./fetch-url";
import testConnectionRouter from "./test-connection";
import shareRouter from "./share";
import checkLessonRouter from "./check-lesson";
import learningReportRouter from "./learning-report";
import coursesRouter from "./courses";
import certificatesRouter from "./certificates";
import authRouter from "./auth";
import xapiRouter from "./xapi";
import demoCompletionsRouter from "./demo-completions";

const router: IRouter = Router();

router.use(authRouter);
router.use(healthRouter);
router.use(generateLessonRouter);
router.use(generateMindmapRouter);
router.use(generateSlidesRouter);
router.use(chatRouter);
router.use(fetchUrlRouter);
router.use(testConnectionRouter);
router.use(shareRouter);
router.use(checkLessonRouter);
router.use(learningReportRouter);
router.use("/courses", coursesRouter);
router.use("/certificates", certificatesRouter);
router.use(xapiRouter);
router.use(demoCompletionsRouter);

export default router;
