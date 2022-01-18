import ErrorResponse from "../utils/error.util";
import { asyncHandler, strIncludesEs6, strToArrayEs6, isString } from '@btffamily/tmat'
import {Request, Response, NextFunction } from "express";

import Framework from "../models/Framework.model";

// @desc           Get Frameworks
// @route          GET /api/tma/v1/frameworks
// @access         Private
export const getFrameworks = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(res.advancedResults);
})

// @desc           Get a Framework
// @route          GET /api/tma/v1/frameworks/:id
// @access         Private/Superadmin/Admin
export const getFramework = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    const framework = await Framework.findById(req.params.id);

    if(!framework){
        return next(new ErrorResponse('Error', 404, ['framework does not exist']))
    }

    res.status(200).json({
        error: false,
        errors: [],
        data: framework,
        message: 'succesful',
        status: 200
    })
})

// @desc           Add a Framework
// @route          POST /api/tma/v1/frameworks
// @access         Private
export const addFramework = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { name, description } = req.body;

    if(!name){
        return next(new ErrorResponse('Error', 404, ['name is required']))
    }

    const exists = await Framework.findOne({ name: name });

    if(exists){
        return next(new ErrorResponse('Error!', 400, ['framwork already exist. use another name']));
    }

    const framework = await Framework.create({
        name,
        description: description ? description : ''
    })

    res.status(200).json({
        error: false,
        errors: [],
        data: framework,
        message: 'succesful',
        status: 200
    })
})

// @desc           Update a Framework
// @route          PUT /api/tma/v1/frameworks/:id
// @access         Private
export const updateFramework = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { name, description } = req.body;

    const framework = await Framework.findById(req.params.id);

    if(!framework){
        return next(new ErrorResponse('Error', 404, ['framework does not exist']))
    }

    const exists = await Framework.findOne({ name: name });

    if(exists){
        return next(new ErrorResponse('Error!', 400, ['framwork already exist. use another name']));
    }

    framework.name = name ? name : framework.name;
    framework.description = description ? description : framework.description;
    await framework.save();

    res.status(200).json({
        error: false,
        errors: [],
        data: framework,
        message: 'succesful',
        status: 200
    })

})