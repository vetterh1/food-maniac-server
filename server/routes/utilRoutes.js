import { Router } from 'express';
import * as GenerateThumbnails from '../util/generateThumbnails';

const router = new Router();


// ----------------  THUMBNAILS ----------------

// Get all Items
router.route('/regenerateAllThumbnails').get(GenerateThumbnails.regenerateAll);

export default router;
