import mongoose, { ObjectId, Model } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/error.util';
import { asyncHandler, strIncludesEs6, strToArrayEs6, isString } from '@btffamily/tmaapp'

import dayjs from 'dayjs'
import customparse from 'dayjs/plugin/customParseFormat';
dayjs.extend(customparse);

// models
import User from '../models/User.model'
import Category from '../models/Category.model'


// @desc           Get all Category
// @route          GET /api/tma/v1/categories
// @access         Private
export const getCategories = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {
	res.status(200).json(res.advancedResults);   
})

// @desc           Get a Category
// @route          GET /api/tma/v1/categories/:id
// @access         Private/Superadmin/Admin
export const getCategory = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {
	
	const category = await Category.findById(req.params.id)

	if(!category){
		return next(new ErrorResponse(`Error!`, 404, ['category does not exist']))
	}

	res.status(200).json({
		error: false,
		errors: [],
		message: `successful`,
		data: category,
		status: 200
	});

})

/** 
 * snippet
 * **/

// @desc        Login user (with verification)
// @route       POST /api/identity/v1/auth/login
// @access      Public
// export const funcd = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {

// })