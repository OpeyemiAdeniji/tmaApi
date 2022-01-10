import express from 'express';

import {
    getAssets,
    getAsset,
    addAsset,
    removeAsset
} from '../../../controllers/asset.controller';

import advancedResults from '../../../middleware/advanced.mw';

const router = express.Router({ mergeParams: true });
// import { protect, authorize } from '../../../middleware/auth.mw';
import { validateChannels as vcd } from '../../../middleware/header.mw'
import Asset from '../../../models/Asset.model'

router.get('/', vcd, advancedResults(Asset), getAssets);
router.get('/:id', vcd, getAsset);
router.post('/', vcd, addAsset)
router.delete('/:id', vcd, removeAsset)

export default router;