import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.post("/ai-tutor", async (_req, res): Promise<void> => {
  res.status(410).json({
    error: "Server-side AI access is disabled. Please use your own API key.",
  });
});

export default router;
