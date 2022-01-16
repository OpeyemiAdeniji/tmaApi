import ErrorResponse from "../utils/error.util";
import { asyncHandler, strIncludesEs6, strToArrayEs6, isString } from '@btffamily/tmat'
import {Request, Response, NextFunction } from "express";

import Industry from "../models/Industry.model";

// @desc           Get Industries
// @route          GET /api/tma/v1/industries
// @access         Private
export const getIndustries = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(res.advancedResults);
})

// @desc           Get an Industry
// @route          GET /api/tma/v1/industries/:id
// @access         Private/Superadmin/Admin
export const getIndustry = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const industry = await Industry.findById(req.params.id);

    if(!industry){
        return next(new ErrorResponse('Error', 404, ['industry does not exist']))
    }

    res.status(200).json({
        error: false,
        errors: [],
        data: industry,
        message: 'succesful',
        status: 200
    })
})