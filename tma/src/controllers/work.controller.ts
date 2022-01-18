import ErrorResponse from "../utils/error.util";
import { asyncHandler, strIncludesEs6, strToArrayEs6, isString } from '@btffamily/tmaapp'
import {Request, Response, NextFunction } from "express";
import dayjs from "dayjs";
import customParse from "dayjs/plugin/customParseFormat";
dayjs.extend(customParse)

import Work from "../models/Work.model";

// @desc           Get all Works
// @route          GET /api/tma/v1/works
// @access         Private
export const getWorks = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(res.advancedResults);
})

// @desc   Get A work 
// @route  GET /api/tma/v1/works/:id
// @access Private
export const getWork = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const work = await Work.findById(req.params.id);

    if(!work){
        return next(new ErrorResponse('Error', 404, ['cannot find work']))
    }

    res.status(200).json({
        error: false,
        errors: [],
        data: work,
        message: 'succesful',
        status: 200
    });
});
