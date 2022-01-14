import crypto from 'crypto';
import mongoose, { ObjectId, Model } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/error.util';
import { sendGrid } from '../utils/email.util';
import { asyncHandler, strIncludesEs6, strToArrayEs6, isString } from '@btffamily/tmat'
import { generate } from '../utils/random.util';
import { userLogger } from '../config/wiston';
import { uploadBase64File } from '../utils/google.util'

import dayjs from 'dayjs'
import customparse from 'dayjs/plugin/customParseFormat';
dayjs.extend(customparse);

// models
import User from '../models/User.model'
import Business from '../models/Business.model';


// @desc           Get all businesses
// @route          GET /api/tma/v1/businesses
// @access         Private
export const getBusinesses = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {
	res.status(200).json(res.advancedResults);   
})

// @desc    Get a business
// @route   GET /api/tma/v1/businesses/get-business/:id
// @access  Private/Superadmin/Admin
export const getBusiness = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {
	
	const business = await Business.findOne({ user: req.params.id }).populate([{ path: 'user' }])

	if(!business){
		return next(new ErrorResponse(`Error!`, 404, ['business does not exist']))
	}

    const user = await User.findById(business.user);

    if(user?.userType !== 'business'){
        return next(new ErrorResponse(`Error!`, 404, ['business does not exist']))
    }

	res.status(200).json({
		error: false,
		errors: [],
		message: `successful`,
		data: business,
		status: 200
	});

})


// @desc    Get a third party org.
// @route   GET /api/tma/v1/businesses/get-organization/:id
// @access  Private/Superadmin/Admin
export const getOrganization = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {
	
	const business = await Business.findOne({ user: req.params.id }).populate([{ path: 'user' }])

	if(!business){
		return next(new ErrorResponse(`Error!`, 404, ['business does not exist']))
	}

    const user = await User.findById(business.user);

    if(user?.userType !== 'third-party'){
        return next(new ErrorResponse(`Error!`, 404, ['business does not exist']))
    }

	res.status(200).json({
		error: false,
		errors: [],
		message: `successful`,
		data: business,
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