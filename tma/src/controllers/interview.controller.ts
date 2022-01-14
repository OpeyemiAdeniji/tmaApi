import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../utils/error.util";
import { asyncHandler } from "@btffamily/tmat";

// models
import Interview from '../models/Interview.model'

// @desc           Get all Interviews
// @route          GET /api/v1/interviews
// @access         Private
export const getInterviews = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(res.advancedResults);
})

// @desc           Get an Interviews
// @route          GET /api/v1/interviews/:id
// @access         Private/Superadmin/Admin
export const getInterview = asyncHandler(async (req: Request, res: Response, next: NextFunction)=> {

    const interview = await Interview.findOne({ talent: req.params.id}).populate([ {path: 'talent'} ]);

    if (!interview){
        return next(new ErrorResponse('Error!', 404, ['interview does not exist']))
    }

    res.status(200).json({
        error: false,
        errors: [],
        data: interview,
        message: 'Successful',
        status: 200
    })
})