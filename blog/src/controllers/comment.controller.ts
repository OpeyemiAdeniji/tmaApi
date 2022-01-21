import mongoose, { ObjectId, Model } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/error.util';
import { asyncHandler, strIncludesEs6, strToArrayEs6, isString } from '@btffamily/tmaapp'

import dayjs from 'dayjs'
import customparse from 'dayjs/plugin/customParseFormat';
dayjs.extend(customparse);

// models
import User from '../models/User.model'
import Comment from '../models/Comment.model'


// @desc           Get all Comment
// @route          GET /api/tma/v1/comments
// @access         Private
export const getComments = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {
	res.status(200).json(res.advancedResults);   
})

// @desc           Get a Comment
// @route          GET /api/tma/v1/comments/:id
// @access         Private/Superadmin/Admin
export const getComment = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {
	
	const comment = await Comment.findById(req.params.id)

	if(!comment){
		return next(new ErrorResponse(`Error!`, 404, ['comment does not exist']))
	}

	res.status(200).json({
		error: false,
		errors: [],
		message: `successful`,
		data: comment,
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