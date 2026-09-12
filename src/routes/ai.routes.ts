import { Router } from 'express';
import { generateSustainabilityAdvisorReport } from '../modules/ai/ai.controller';

const router = Router();

router.post('/analyze', generateSustainabilityAdvisorReport);

export default router;