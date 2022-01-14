import crypto from 'crypto';
import mongoose, { ObjectId, Model } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/error.util';
import { sendGrid } from '../utils/email.util';
import { asyncHandler, arrayIncludes, strIncludesEs6 } from '@btffamily/tmat'
import { generate } from '../utils/random.util';
import { userLogger } from '../config/wiston';
import { uploadBase64File } from '../utils/google.util'

import dayjs from 'dayjs'
import customparse from 'dayjs/plugin/customParseFormat';
dayjs.extend(customparse);

// models
import User from '../models/User.model'
import Talent from '../models/Talent.model'


// @desc           Get all talents
// @route          GET /api/v1/talents
// @access         Private
export const getTalents = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {
	res.status(200).json(res.advancedResults);   
})

// @desc    Get a talent
// @route   GET /api/v1/talents/:id
// @access  Private/Superadmin/Admin
export const getTalent = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {
	
	const talent = await Talent.findOne({ user: req.params.id }).populate([{ path: 'user' }])

	if(!talent){
		return next(new ErrorResponse(`Error!`, 404, ['talent does not exist']))
	}

	res.status(200).json({
		error: false,
		errors: [],
		message: `successful`,
		data: talent,
		status: 200
	});

})

// @desc    Create a talent
// @route   POST /api/v1/talents/:id
// @access  Private/Superadmin/Admin
export const createTalent = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	
	const {
			firstName, 
			lastName, 
			middleName, 
			gender, 
			phoneNumber, 
			address, 
			level, 
			band, 
			type, 
			currentSalary, 
			employmentStatus, 
			email, 
			linkedinUrl, 
			githubUrl,
			dribbleUrl,
			portfolioUrl,
			resumeUrl
		} = req.body

		const user = await User.findById(req.params.id);

		if(!user){
			return next(new ErrorResponse('Error!', 404, ['user does not exist']));
		}
		
		if(!phoneNumber){
			return next(new ErrorResponse('Error!', 400, ['phone number is required']))
		}
		const exist = await Talent.findOne({ email: email });

		if(exist && arrayIncludes(user.talents, exist._id.toString())){
			return next(new ErrorResponse('Error!', 400, ['talent already exist']))
		}

		const talent = await Talent.create({
			firstName, 
			lastName, 
			middleName, 
			gender, 
			phoneNumber, 
			address, 
			level, 
			band, 
			type, 
			currentSalary, 
			employmentStatus, 
			email, 
			linkedinUrl, 
			githubUrl,
			dribbleUrl,
			portfolioUrl,
			resumeUrl
		})

		talent.user = user._id;
		talent.save();

		user.talents.push(talent._id);
		user.save();

		res.status(200).json({
			error: false,
			errors: [],
			data: talent,
			message: 'successful',
			status: 200
		})

})

/** 
 * snippet
 * **/

// @desc        Login user (with verification)
// @route       POST /api/identity/v1/auth/login
// @access      Public
// export const funcd = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {

// })



