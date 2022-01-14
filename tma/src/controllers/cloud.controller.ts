import ErrorResponse from "../utils/error.util";
import { asyncHandler, strIncludesEs6, strToArrayEs6, isString } from '@btffamily/tmat'
import {Request, Response, NextFunction } from "express";

import Cloud from "../models/Cloud.model";

// @desc           Get all Clouds
// @route          GET /api/tma/v1/clouds
// @access         Private
export const getClouds = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(res.advancedResults);
})

// @desc           Get a Cloud
// @route          GET /api/tma/v1/clouds/:id
// @access         Private/Superadmin/admin
export const getCloud = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    const cloud = await Cloud.findById(req.params.id);

    if(!cloud){
        return next(new ErrorResponse('Error', 404, ['cloud does not exist']));
    }

    res.status(200).json({
        error: false,
        errors: [],
        data: cloud,
        message: 'succesful',
        status: 200
    })
})