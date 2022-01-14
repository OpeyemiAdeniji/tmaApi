import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "@btffamily/tmat";
import ErrorResponse from '../utils/error.util'

// models
import Preselect from '../models/Preselect.model'

// @desc           Get all Preselects
// @route          GET /api/v1/preselects
// @access         Private
export const getPreselects = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(res.advancedResults);
});

// @desc           Get a Preselect
// @route          GET /api/v1/preselects/:id
// @access         Private/Superadmin/Admin
export const getPreselect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
    const select = await Preselect.findById(req.params.id ).populate([ { path: 'talent'}, { path: 'preselect'} ]);

    if(!select){
        return next(new ErrorResponse('Error!', 404, ['preselected talent does not exist']))
    }
})