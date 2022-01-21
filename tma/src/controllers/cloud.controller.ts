import ErrorResponse from "../utils/error.util";
import { asyncHandler, strIncludesEs6, strToArrayEs6, isString } from '@btffamily/tmaapp'
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

// @desc           Add a Cloud
// @route          POST /api/tma/v1/clouds
// @access         Private
export const addCloud = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { name, code, description } = req.body;

    if(!name){
        return next(new ErrorResponse('Error', 404, ['name is required']))
    }

    const existsByName = await Cloud.findOne({ name: name });

    if(existsByName){
        return next(new ErrorResponse('Error!', 400, ['cloud platform already exist. user another name']));
    }

    const existsByCode = await Cloud.findOne({ code: code });

    if(existsByCode){
        return next(new ErrorResponse('Error!', 400, ['cloud platform already exist. user another code']));
    }

    const cloud = await Cloud.create({
        name,
        code,
        description: description ? description : ''
    })

    res.status(200).json({
        error: false,
        errors: [],
        data: cloud,
        message: 'succesful',
        status: 200
    })
})

// @desc           Update a Cloud
// @route          PUT /api/tma/v1/clouds/:id
// @access         Private
export const updateCloud = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { name, code, description } = req.body;

    const cloud = await Cloud.findById(req.params.id);

    if(!cloud){
        return next(new ErrorResponse('Error', 404, ['cloud does not exist']))
    }

    const existsByName = await Cloud.findOne({ name: name });

    if(existsByName){
        return next(new ErrorResponse('Error!', 400, ['cloud platform already exist. user another name']));
    }

    const existsByCode = await Cloud.findOne({ code: code });

    if(existsByCode){
        return next(new ErrorResponse('Error!', 400, ['cloud platform already exist. user another code']));
    }

    cloud.name = name ? name : cloud.name;
    cloud.code = code ? code : cloud.code;
    cloud.description = description ? description : cloud.description;
    await cloud.save();

    res.status(200).json({
        error: false,
        errors: [],
        data: cloud,
        message: 'succesful',
        status: 200
    })
})