import mongoose, { ObjectId, Model } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/error.util';
import { asyncHandler, strIncludesEs6, strToArrayEs6, isString } from '@btffamily/tmaapp'

import dayjs from 'dayjs'
import customparse from 'dayjs/plugin/customParseFormat';
dayjs.extend(customparse);

// models
import User from '../models/User.model'
import Tag from '../models/Tag.model'


// @desc           Get all Tag
// @route          GET /api/tma/v1/tags
// @access         Private
export const getTags = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {
	res.status(200).json(res.advancedResults);   
})

// @desc           Get a Tag
// @route          GET /api/tma/v1/tags/:id
// @access         Private/Superadmin/Admin
export const getTag = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {
	
	const tag = await Tag.findById(req.params.id)

	if(!tag){
		return next(new ErrorResponse(`Error!`, 404, ['tag does not exist']))
	}

	res.status(200).json({
		error: false,
		errors: [],
		message: `successful`,
		data: tag,
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