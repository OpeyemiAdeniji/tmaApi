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
import Role from '../models/Role.model'
import Notification from '../models/Notification.model'
import Status from '../models/Status.model'


// @desc           Get all users
// @route          GET /api/v1/users
// @access         Private
export const getUsers = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {
	res.status(200).json(res.advancedResults);   
})

// @desc    Get a user
// @route   GET /api/v1/users/:id
// @access  Private/Superadmin/Admin
export const getUser = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {
	
	const user = await User.findById(req.params.id).populate(
	[
		{ path: 'roles', select: '_id name resources' },
	]);

	if(!user){
		return next(new ErrorResponse(`Error!`, 404, ['Could not find user']))
	}

	res.status(200).json({
		error: false,
		errors: [],
		message: `successful`,
		data: user.isSuper ? [] : user,
		status: 200
	});

})

// @desc    Get all talents
// @route   GET /api/v1/users/talents
// @access  Public // superadmin
export const getTalents = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {

	let result: object | any = {
		count: 0,
		data: null
	}

	const { active } = req.query;

	const users = await User.find({}).populate([{path: 'talent'}]);

	const talents = users.filter((u) => u.isTalent === true);
	const activeTalents= talents.filter((a) => a.isActive === true);

	if(active && active === 'true'){
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
// @route   GET /api/v1/users/businesses
// @access  Public // superadmin
export const getBusinesses = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {

	let result: object | any = {
		count: 0,
		data: null
	}

	const { active } = req.query;

	const users = await User.find({ userType: 'business' }).populate([{path: 'business'}]);

	const businesses = users.filter((u) => u.isBusiness === true);
	const activeBusinesses = businesses.filter((a) => a.isActive === true);

	if(active && active === 'true'){
		result.count = activeBusinesses.length;
		result.data = activeBusinesses;
	}else{
		result.count = businesses.length;
		result.data = businesses;
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

// @desc    Get all businesses [these are people who supply the talents]
// @route   GET /api/v1/users/organizations
// @access  Public // superadmin
export const getOrganizations = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {

	let result: object | any = {
		count: 0,
		data: null
	}

	const { active } = req.query;

	const users = await User.find({ userType: 'third-party' }).populate([{path: 'business'}]);

	const businesses = users.filter((u) => u.isBusiness === true);
	const activeBusinesses = businesses.filter((a) => a.isActive === true);

	if(active && active === 'true'){
		result.count = activeBusinesses.length;
		result.data = activeBusinesses;
	}else{
		result.count = businesses.length;
		result.data = businesses;
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


// @desc    Get user statuses
// @route   GET /api/v1/users/status/:id
// @access  Private // superadmin // user
export const getUserStatus = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {

	let result: any;

	const user = await User.findById(req.params.id);

	if(!user){
		return next(new ErrorResponse('Error', 404, ['user does not exist']))
	}

	const status = await Status.findOne({ user: user._id });

	if(!status){
		result = {
			profile: false,
			application: false,
			activated: false
		}
	}else{
		result = {
			profile: status.profile ? status.profile  : false,
			address: status.application ? status.application : false,
			activated: status.activated ? status.activated : false
		};
	}

	res.status(200).json({
		error: false,
		errors: [],
		data: result,
		message: `Successful`,
		status: 200
	});

})


// @desc        Change password
// @route       PUT /api/identity/v1/users/change-password/:id
// @access      Private
export const changePassword = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {

	const { oldPassword, newPassword, code } = req.body;

	// validate email and password
	if(!oldPassword || !oldPassword){
		return next(new ErrorResponse('invalid', 400, ['old password is required', 'new password is required']));
	}

	// check for user
	const user = await User.findById(req.params.id).select('+password');

	if(!user){
		return next(new ErrorResponse('Error', 400, ['invalid credentials']))
	}

	const isMatched = await user.matchPassword(oldPassword);

	if(!isMatched){
		return next(new ErrorResponse('Error', 400, ['invalid credentials']))
	}

	if(!code && !user.isSuper){

		const mailCode = await generate(6, false);

		let emailData = {
			template: 'email-verify',
			email: user.email,
			preheaderText: 'Verify your email',
			emailTitle: 'Email Verification',
			emailSalute: 'Hi Champ',
			bodyOne: 'Please verify your email using the code below',
			bodyTwo: `${mailCode}`,
			fromName: 'Checkaam'
		}

		await sendGrid(emailData);

		user.emailCode = mailCode.toString();
		user.emailCodeExpire = ( Date.now() + 5 * 60 * 1000 as unknown) as Date // 1 minute
		await user.save();

		res.status(206).json({
			error: true,
			errors: ['email verification is required'],
			data: null,
			message: 'verification required',
			status: 206
		})
	}

	if(code && !user.isSuper){

		const codeMatched = await User.findOne({ emailCode: code, emailCodeExpire: {$gt: new Date() }})

		if(!codeMatched){
			return next(new ErrorResponse('invalid code', 400, ['invalid verification code']))
		}

		user.password = newPassword;
		await user.save();

		res.status(200).json({
			error: false,
			errors: [],
			data: null,
			message: 'successfull',
			status: 200
		})

	}

})

/** 
 * snippet
 * **/

// @desc        Login user (with verification)
// @route       POST /api/identity/v1/auth/login
// @access      Public
// export const funcd = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {

// })



