import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { uploadFiles } from '../middleware/upload.js';
import { listTools, processTool } from '../controllers/toolController.js';

const router = Router();

router.get('/', requireAuth, listTools);
router.post('/:toolId/process', requireAuth, uploadFiles, processTool);

export default router;
