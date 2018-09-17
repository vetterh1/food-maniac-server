import { Router } from 'express';
import * as GenerateThumbnails from '../util/generateThumbnails';
import * as OgoneGateway from '../util/ogoneGateway';

const router = new Router();


// ----------------  OGONE ----------------

router.route('/computeHash').post(OgoneGateway.computeHash);



// ----------------  THUMBNAILS ----------------

// Regenerate all items
router.route('/regenerateAllThumbnails').post(GenerateThumbnails.regenerateAll);

// Generate one item
router.route('/generateOneThumbnail').post(GenerateThumbnails.generateOneThumbnail);

export default router;
