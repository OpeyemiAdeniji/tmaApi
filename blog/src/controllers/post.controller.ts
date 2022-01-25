import mongoose, { ObjectId, Model } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/error.util';
import { asyncHandler, strIncludesEs6, strToArrayEs6, isString } from '@btffamily/tmaapp'

import dayjs from 'dayjs'
import customparse from 'dayjs/plugin/customParseFormat';
dayjs.extend(customparse);

// models
import Post from '../models/Post.model'

// @desc           Get all Post
// @route          GET /api/tma/v1/posts
// @access         Private
export const getPosts = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {
	res.status(200).json(res.advancedResults);   
})

// @desc           Get a Post
// @route          GET /api/tma/v1/posts/:id
// @access         Private/Superadmin/Admin
export const getPost = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {
	
	const post = await Post.findById(req.params.id)

	if(!post){
		return next(new ErrorResponse(`Error!`, 404, ['post does not exist']))
	}

	res.status(200).json({
		error: false,
		errors: [],
		message: `successful`,
		data: post,
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