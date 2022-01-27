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
import Business from '../models/Business.model';
import Talent from '../models/Talent.model';


// @desc           Get all businesses
// @route          GET /api/tma/v1/businesses
// @access         Private
export const getBusinesses = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {
	res.status(200).json(res.advancedResults);   
})

// @desc           Get all third party businesses
// @route          GET /api/tma/v1/businesses/third-party
// @access         Private
export const getThirdParties = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {
	res.status(200).json(res.advancedResults);   
})

// @desc           Get a businesses
// @route          GET /api/tma/v1/businesses/:id
// @access         Private/Superadmin/Admin
export const getBusiness = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {
	
	const business = await Business.findOne({ user: req.params.id }).populate([{ path: 'user' }])

	if(!business){
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

// @desc           Get business favourites
// @route          GET /api/tma/v1/businesses/get-favourites/:id
// @access         Private/Superadmin/Admin
export const getBusinessFavourites = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {
	
	const user = await User.findById(req.params.id);

	if(!user){
		return next(new ErrorResponse(`Error!`, 404, ['user does not exist']))
	}

	const business = await Business.findOne({ user: user._id }).populate([{path: 'favourites'}]);

	if(!business){
		return next(new ErrorResponse(`Error!`, 404, ['business does not exist']))
	}

	res.status(200).json({
		error: false,
		errors: [],
		message: `successful`,
		data: business.favourites,
		status: 200
	});

})

// @desc           Get a businesses
// @route          GET /api/tma/v1/businesses/third-party/:id
// @access         Private/Superadmin/Admin
export const getThirdParty = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {
	
	const tPartyBusiness = await Business.findOne({ user: req.params.id }).populate([{ path: 'user' }])

	if(!tPartyBusiness){
		return next(new ErrorResponse(`Error!`, 404, ['third party business does not exist']))
	}

	res.status(200).json({
		error: false,
		errors: [],
		message: `successful`,
		data: tPartyBusiness,
		status: 200
	});

})

// @desc           Add favourite
// @route          GET /api/tma/v1/businesses/add-favorite/:id
// @access         Private/Superadmin/Admin
export const addFavourite = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {
	
	const { email } = req.body;

	if(!email){
		return next(new ErrorResponse(`Error!`, 404, ['talent email is required']))
	}

	const user = await User.findById(req.params.id);

	if(!user){
		return next(new ErrorResponse(`Error!`, 404, ['user does not exist']))
	}

	const business = await Business.findOne({ user: user._id });

	if(!business){
		return next(new ErrorResponse(`Error!`, 404, ['business does not exist']))
	}

	const talent = await Talent.findOne({ email: email });
	
	if(!talent){
		return next(new ErrorResponse(`Error!`, 404, ['talent does not exist']))
	}

	business.favourites.push(talent._id);
	await business.save();

	const biz = await Business.findOne({ user: user._id }).populate([{path: 'favourites'}]);


	res.status(200).json({
		error: false,
		errors: [],
		message: `successful`,
		data: biz!.favourites,
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