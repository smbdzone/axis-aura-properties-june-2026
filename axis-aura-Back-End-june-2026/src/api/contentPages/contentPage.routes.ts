import express from 'express';
import { getContentPage, updateContentPage } from './contentPage.controller';
import { authenticate, requireSuperAdmin } from '../../middleware/auth.middleware';

const router = express.Router();

router.get('/:slug', getContentPage);
router.put('/:slug', authenticate, requireSuperAdmin, updateContentPage);

export default router;
