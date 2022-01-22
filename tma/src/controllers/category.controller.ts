import ErrorResponse from "../utils/error.util";
import { asyncHandler, strIncludesEs6, strToArrayEs6, isString } from '@btffamily/tmaapp'
import {Request, Response, NextFunction } from "express";

import Category from "../models/Category.model";

// @desc           Get Categories
// @route          GET /api/tma/v1/categories
// @access         Private
export const getCategories = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(res.advancedResults);
})

// @desc           Get a Category
// @route          GET /api/tma/v1/categories/:id
// @access         Private/Superadmin/Admin
export const getCategory = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    const category = await Category.findById(req.params.id);

    if(!category){
        return next(new ErrorResponse('Error', 404, ['category does not exist']))
    }

    res.status(200).json({
        error: false,
        errors: [],
        data: category,
        message: 'succesful',
        status: 200
    })
})

// @desc           Add a Category
// @route          POST /api/tma/v1/categories
// @access         Private
export const addCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    

    res.status(200).json({
        error: false,
        errors: [],
        data: null,
        message: 'succesful',
        status: 200
    })
})

// @desc           Update a Category
// @route          PUT /api/tma/v1/categories/:id
// @access         Private
export const updateCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    res.status(200).json({
        error: false,
        errors: [],
        data: null,
        message: 'succesful',
        status: 200
    })

})