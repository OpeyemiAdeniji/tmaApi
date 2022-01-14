import ErrorResponse from "../utils/error.util";
import { asyncHandler, strIncludesEs6, strToArrayEs6, isString } from '@btffamily/tmat'
import {Request, Response, NextFunction } from "express";

import Framework from "../models/Framework.model";

// @desc    Get All Frameworks 
// @ route  GET /api/tma/v1/frameworks
// @ access Public
export const getFrameworks = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(res.advancedResults);
})

// @desc   Get A Framework 
// @route  GET /api/tma/v1/frameworks/:id
// @access Public
export const getFramework = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const framework = await Framework.findById(req.params.id);

    if(!framework){
        return next(new ErrorResponse('Error', 404, ['cannot find framework']))
    }

    res.status(200).json({
        error: false,
        errors: [],
        data: framework,
        message: 'succesful',
        status: 200
    })
})