import crypto from 'crypto';
import mongoose, { ObjectId, Model } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/error.util';
import { sendGrid } from '../utils/email.util';
import { asyncHandler, strIncludesEs6, strToArrayEs6, isString } from '@btffamily/tmaapp'
import { generate } from '../utils/random.util';
import { userLogger } from '../config/wiston';
import { uploadBase64File } from '../utils/google.util'

import dayjs from 'dayjs'
import customparse from 'dayjs/plugin/customParseFormat';
dayjs.extend(customparse);

// models
import User from '../models/User.model'
import Talent from '../models/Talent.model'
import Business from '../models/Business.model'


// @desc    Get all talents
// @route   GET /api/v1/users/talents
// @access  Public // superadmin
export const getTalents = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {

	let result: object | any = {
		count: 0,
		data: null
	}

	const { active } = req.query;

	const talents = await Talent.find({}).populate([{path: 'user'}]);
	const activeTalents= talents.filter((t) => t.user.isActive === true);

	if(active && active.toString() === 'true'){
		result.count = activeTalents.length;
		result.data = activeTalents;
	}else{
		result.count = talents.length;
		result.data = talents;
	}

	res.status(200).json({
		error: false,
		errors: [],
		count: result.count,
		message: `Successful`,
		data: result.data,
		status: 200
	});

})

// @desc    Get all businesses [these are people who hire the talents]
// @route   GET /api/v1/users/businesses?active="true"&type="business"
// @access  Public // superadmin
export const getBusinesses = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {

	let result: object | any = {
		count: 0,
		data: null
	}

	const { active, type} = req.query;

	const businesses = await Business.find({}).populate([{path: 'user'}]);
	const activeBusinesses = businesses.filter((b) => b.user.isActive === true);

	if(active && active.toString() === 'true'){

		if(type){

			const typeBusinesses = activeBusinesses.filter((b) => b.businessType === type);
			result.count = typeBusinesses.length;
			result.data = typeBusinesses;

		}else{

			result.count = activeBusinesses.length;
			result.data = activeBusinesses;

		}

		


	}else{

		if(type){

			const typeBusinesses = businesses.filter((b) => b.businessType === type);
			result.count = typeBusinesses.length;
			result.data = typeBusinesses;

		}else{

			result.count = businesses.length;
			result.data = businesses;

		}


		
	}


	res.status(200).json({
		error: false,
		errors: [],
		count: result.count,
		message: `Successful`,
		data: result.data,
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



