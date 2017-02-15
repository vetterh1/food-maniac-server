import { Router } from 'express';
import * as GenerateThumbnails from '../util/generateThumbnails';

const router = new Router();


// ----------------  THUMBNAILS ----------------

// Regenerate all items
router.route('/regenerateAllThumbnails').post(GenerateThumbnails.regenerateAll);

// Generate one item
router.route('/generateOneThumbnail').post(GenerateThumbnails.generateOneThumbnail);

export default router;
