import express from 'express';
//
import {
    getLocations,
    getLocation,
    addLocation,
    enableLocation,
    disableLocation,
    turnLocationOn,
    turnLocationOff
} from '../../../controllers/location.controller';

import advancedResults from '../../../middleware/advanced.mw';

const router = express.Router({ mergeParams: true });
import { protect, authorize } from '../../../middleware/auth.mw';
import { validateChannels as vcd } from '../../../middleware/header.mw'
import Location from '../../../models/Location.model'

router.get('/', vcd, advancedResults(Location), getLocations);
router.get('/:id', vcd, getLocation);
router.post('/', vcd, protect, authorize(['superadmin', 'admin']), addLocation)
router.put('/enable/:id', vcd, protect, authorize(['superadmin', 'admin']), enableLocation)
router.put('/disable/:id', vcd, protect, authorize(['superadmin', 'admin']), disableLocation)
router.put('/turn-on/:id', vcd, protect, authorize(['superadmin', 'admin']), turnLocationOn)
router.put('/turn-off/:id', vcd, protect, authorize(['superadmin', 'admin']), turnLocationOff)

export default router;