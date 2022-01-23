import ErrorResponse from "../utils/error.util";
import { asyncHandler, strIncludesEs6, strToArrayEs6, isString } from '@btffamily/tmaapp'
import {Request, Response, NextFunction } from "express";

import Tool from "../models/Tool.model";

// @desc           Get Tools
// @route          GET /api/tma/v1/tools
// @access         Private
export const getTools = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(res.advancedResults);
})

// @desc           Get a Tool
// @route          GET /api/tma/v1/tools/:id
// @access         Private/Superadmin/Admin
export const getTool = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    const tool = await Tool.findById(req.params.id);

    if(!tool){
        return next(new ErrorResponse('Error', 404, ['tool does not exist']))
    }

    res.status(200).json({
        error: false,
        errors: [],
        data: tool,
        message: 'succesful',
        status: 200
    })
})

// @desc           Add a Tool
// @route          POST /api/tma/v1/tools
// @access         Private
export const addTool = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    

    res.status(200).json({
        error: false,
        errors: [],
        data: null,
        message: 'succesful',
        status: 200
    })
})

// @desc           Update a Tool
// @route          PUT /api/tma/v1/tools/:id
// @access         Private
export const updateTool = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    res.status(200).json({
        error: false,
        errors: [],
        data: null,
        message: 'succesful',
        status: 200
    })

})