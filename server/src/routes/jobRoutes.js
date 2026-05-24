import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getSingleJob, listJobs } from '../controllers/jobController.js';

const router = Router();

router.get('/', requireAuth, listJobs);
router.get('/:jobId', requireAuth, getSingleJob);

export default router;

