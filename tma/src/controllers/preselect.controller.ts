import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "@btffamily/tmaapp";
import ErrorResponse from '../utils/error.util'

// models
import Preselect from '../models/Preselect.model'

// @desc           Get all Preselects
// @route          GET /api/tma/v1/preselects
// @access         Private
export const getPreselects = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(res.advancedResults);
});

// @desc           Get a Preselect
// @route          GET /api/tma/v1/preselects/:id
// @access         Private/Superadmin/Admin
export const getPreselect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
    const select = await Preselect.findById(req.params.id).populate([ { path: 'talent'} ]);

    if(!select){
        return next(new ErrorResponse('Error!', 404, ['could not find preselected talent']))
    }

    res.status(200).json({
        error: false,
        errors: [],
        data: select,
        message: 'successful',
        status: 200
    })
})