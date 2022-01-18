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

import nats from '../events/nats';
import UserCreated from '../events/publishers/user-created'


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
			fromName: 'MYRIOI'
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


// @desc        Add Business manager
// @route       POST /api/identity/v1/users/add-manager?invite=false
// @access      Private
export const addManager = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {

	const { firstName, lastName, email, phoneNumber, phoneCode, callback} = req.body;
	const { invite } = req.query;

	if(invite && invite.toString() === 'true' && !callback){
		return next(new ErrorResponse('Error', 400, ['invite callback url is required']));
	}

	// validate
	if(!firstName){
		return next(new ErrorResponse('Error', 400, ['first name is required']));
	}

	if(!lastName){
		return next(new ErrorResponse('Error', 400, ['last name is required']));
	}

	if(!email){
		return next(new ErrorResponse('Error', 400, ['email is required']));
	}

	const existing = await User.findOne({email: email});

	if(!existing){
		return next(new ErrorResponse('Error', 403, ['email already exists']));
	}

	if(!phoneNumber){
		return next(new ErrorResponse('Error', 400, ['phone number is required']));
	}

	if(!phoneCode){
		return next(new ErrorResponse('Error', 400, ['phone code is required']));
	}

	if(!strIncludesEs6(phoneCode, '+')){
        return next(new ErrorResponse('Error', 400, ['phone code is must include \'+\' sign']));
    }

	// format phone number
	let phoneStr: string;
	if(strIncludesEs6(phoneCode, '-')){
		phoneStr = phoneCode.substring(3);
	}else{
		phoneStr = phoneCode.substring(1);
	}

	const phoneExists = await User.findOne({ phoneNumber: phoneStr + phoneNumber.substring(1) });

	if(phoneExists){
		return next(new ErrorResponse('Error', 400, ['phone number already exists']));
	}

	const role = await Role.findOne({ name: 'manager' }); // get the manager role

	if(!role){
		return next(new ErrorResponse('Error', 500, ['role not found. contact support team.']));
	}

	const password = await generate(8, true);  // generate password

	const user = await User.create({

		firstName,
		lastName,
        email,
        password: password,
		passwordType: 'generated',
		savedPassword: password,
		phoneNumber: phoneStr + phoneNumber.substring(1),
		userType: 'manager',
        isSuper: false,
		isActivated: false,
		isAdmin: false,
		isTalent: false,
		isBusiness: false,
		isManager: true,
		isUser: true,
		isActive: true

	})

	user.roles.push(role?._id);
	const token = user.getInviteToken();
	await user.save({ validateBeforeSave: false });

	const inviteLink = `${callback}/${token}`;

	if(invite && invite.toString() === 'true'){

		let emailData = {
			template: 'welcome',
			email: user.email,
			preheaderText: 'MYRIOI Invitation',
			emailTitle: 'MYRIOI Invite',
			emailSalute: 'Hello ' + user.firstName + ',',
			bodyOne: 'MYRIOI has invited you to join them as a business manager on their talent management platform.',
			bodyTwo: 'You can accept invitation by clicking the button below or ignore this email to decline. Invitation expires in 24 hours',
			buttonUrl: `${inviteLink}`,
			buttonText: 'Accept Invite',
			fromName: 'MYRIOI'
		}

		await sendGrid(emailData);
	}

	const returnData = {
		firstName: user.firstName,
		lastName: user.lastName,
        email: user.email,
		phoneNumber: user.phoneNumber,
		phoneCode: phoneCode,
		role: {
			_id: role?._id,
			name: role?.name
		},
		inviteLink: `${callback}/${token}`,
		userType: user.userType
	}

	// publish to NATS
	await new UserCreated(nats.client).publish({ user: returnData, userType: returnData.userType, phoneCode: phoneCode })

	res.status(206).json({
		error: true,
		errors: [],
		data: returnData,
		message: 'successful',
		status: 206
	})

})

// @desc        Add Talent
// @route       POST /api/identity/v1/users/add-talent?invite=false
// @access      Private
export const addTalent = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

	const { firstName, lastName, email, phoneNumber, phoneCode, callback } = req.body;

	const { invite } = req.query;

	if(invite && invite.toString() === 'true' && !callback){
		return next(new ErrorResponse('Error', 400, ['invite callback url is required']));
	}

	// validate
	if(!firstName){
		return next(new ErrorResponse('Error', 400, ['first name is required']));
	}

	if(!lastName){
		return next(new ErrorResponse('Error', 400, ['last name is required']));
	}

	if(!email){
		return next(new ErrorResponse('Error', 400, ['email is required']));
	}

	const existing = await User.findOne({email: email});

	if(!existing){
		return next(new ErrorResponse('Error', 403, ['email is already existing']));
	}

	if(!phoneNumber){
		return next(new ErrorResponse('Error', 400, ['phone number is required']));
	}

	if(!phoneCode){
		return next(new ErrorResponse('Error', 400, ['phone code is required']));
	}

	if(!strIncludesEs6(phoneCode, '+')){
        return next(new ErrorResponse('Error', 400, ['phone code is must include \'+\' sign']));
    }

	// format phone number
	let phoneStr: string
	if(strIncludesEs6(phoneCode, '_')){
		phoneStr = phoneCode.subString(3);
	}else{
		phoneStr = phoneCode.subString(1)
	}

	// check if number exist
	const phoneExists = await User.findOne({ phoneNumber: phoneStr + phoneNumber.substring(1)});
	
	if(phoneExists){
		return next(new ErrorResponse('Error', 400, ['phone number already exists']));
	}

	// find role
	const role = await Role.findOne({ name: 'talent' });

	if(!role){
		return next(new ErrorResponse('Error', 500, ['role not found. contact support team.']));
	}

	// generate password
	const password = await generate(8, true);

	const user = await User.create({
		firstName, 
		lastName, 
		email, 
		password, 
		passwordType: 'generated',
		savedPassword: password,
		phoneNumber: phoneStr + phoneNumber.subString(1), 
		userType: 'talent',
        isSuper: false,
		isActivated: false,
		isAdmin: false,
		isTalent: true,
		isBusiness: false,
		isManager: false,
		isUser: true,
		isActive: true
	})

	user.roles.push(role?._id);
	const token = user.getInviteToken();
	await user.save({ validateBeforeSave: false });
	user.save();

	const inviteLink = `${callback}/${token}`;

	if(invite && invite.toString() === 'true'){

		let emailData = {
			template: 'welcome',
			email: user.email,
			preheaderText: 'MYRIOI Invitation',
			emailTitle: 'MYRIOI Invite',
			emailSalute: 'Hello ' + user.firstName + ',',
			bodyOne: 'MYRIOI has invited you to join them as a talent on their talent management platform.',
			bodyTwo: 'You can accept invitation by clicking the button below or ignore this email to decline. Invitation expires in 24 hours',
			buttonUrl: `${inviteLink}`,
			buttonText: 'Accept Invite',
			fromName: 'MYRIOI'
		}

		await sendGrid(emailData);
	}

		const returnData = {
			firstName: user.firstName,
			lastName: user.lastName,
			phoneNumber: user.phoneNumber,
			email: user.email,
			phoneCode: phoneCode,
			role: {
				_id: role?._id,
				name: role?.name
			},

			invite: `${callback}/${token}`,
			userType: user.userType
		}

		// publish to NATS
		await new UserCreated(nats.client).publish({ user: returnData, userType: returnData.userType, phoneCode: phoneCode })

		res.status(206).json({
			error: true,
			errors: [],
			data: returnData,
			message: 'successful',
			status: 206
		})

})

// @desc        Add Business
// @route       POST /api/identity/v1/users/add-business?type="business"  [pass third-party as type]
// @access      Private
export const addBusiness = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

	const { 
		businessName, 
		email, 
		phoneNumber, 
		phoneCode, 
		callback, 
		industry,
		location,
		address,
		websiteUrl,

	} = req.body;

	const { type } = req.query;

	if(!callback){
		return next(new ErrorResponse('Error', 400, ['callback url is required']));
	}

	if(!type){
		return next(new ErrorResponse('Error', 400, ['business type is required']));
	}

	// validate
	if(!businessName){
		return next(new ErrorResponse('Error', 400, ['business name is required']));
	}

	if(!email){
		return next(new ErrorResponse('Error', 400, ['email is required']));
	}

	const existing = await User.findOne({email: email});

	if(!existing){
		return next(new ErrorResponse('Error', 403, ['email is already existing']));
	}

	if(!phoneNumber){
		return next(new ErrorResponse('Error', 400, ['phone number is required']));
	}

	if(!phoneCode){
		return next(new ErrorResponse('Error', 400, ['phone code is required']));
	}

	if(!strIncludesEs6(phoneCode, '+')){
        return next(new ErrorResponse('Error', 400, ['phone code is must include \'+\' sign']));
    }

	// format phone number
	let phoneStr: string
	if(strIncludesEs6(phoneCode, '_')){
		phoneStr = phoneCode.subString(3);
	}else{
		phoneStr = phoneCode.subString(1)
	}

	// check if number exist
	const phoneExists = await User.findOne({ phoneNumber: phoneStr + phoneNumber.substring(1)});
	
	if(phoneExists){
		return next(new ErrorResponse('Error', 400, ['phone number already exists']));
	}

	// find role
	const role = await Role.findOne({ name: 'business' })

	// generate password
	const password = await generate(8, true);

	const user = await User.create({
		firstName: businessName, 
		lastName: businessName, 
		email, 
		password, 
		passwordType: 'generated',
		savedPassword: password,
		phoneNumber: phoneStr + phoneNumber.subString(1), 
		userType: type ? type : 'business',
        isSuper: false,
		isActivated: false,
		isAdmin: false,
		isTalent: false,
		isBusiness: true,
		isManager: false,
		isUser: true,
		isActive: true
	})

	let emailData = {
		template: 'email-verify',
		email: user.email,
		preheaderText: 'MYRIOI',
		emailTitle: 'Welcome to MYRIOI',
		emailSalute: 'Hello ' + user.firstName + ',',
		bodyOne: 'MYRIOI has added you as a business on their talent management platform. Thank you for joining our platform.',
		bodyTwo: 'Please note that you will be informed when there is a talent match for your business.',
		fromName: 'MYRIOI'
	}

	await sendGrid(emailData);

	const returnData = {
		firstName: user.firstName,
		lastName: user.lastName,
		phoneNumber: user.phoneNumber,
		email: user.email,
		phoneCode: phoneCode,
		role: {
			_id: role?._id,
			name: role?.name
		},
		userType: user.userType,
		industry: industry,
		location: location,
		address: address,
		websiteUrl: websiteUrl

	}

	// publish to NATS
	await new UserCreated(nats.client).publish({ user: returnData, userType: returnData.userType, phoneCode: phoneCode })

	res.status(206).json({
		error: true,
		errors: [],
		data: returnData,
		message: 'successful',
		status: 206
	})

})

// @desc        Accept Invite
// @route       PUT /api/identity/v1/users/accept-invite
// @access      Private
export const acceptInvite = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {
	
	const { token } = req.body;

	if(!token){
		return new ErrorResponse('Error', 400, ['token is required'])
	}

	const linkMatched = await User.findOne({ inviteToken: token, inviteTokenExpire: { $gt: new Date() } }) 

	if(!linkMatched){
		return next(new ErrorResponse('invalid token', 400, ['invite link expired']))
	}

	linkMatched.inviteToken = undefined;
	linkMatched.inviteTokenExpire = undefined;
	await linkMatched.save();
	
	res.status(206).json({
		error: true,
		errors: [],
		data: null,
		message: 'successful',
		status: 206
	})

})


// @desc        Add Talent
// @route       PUT /api/identity/v1/users/add-talent
// @access      Private/superadmin/admin
export const AddTalent = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const {
		firstName,
		lastName,
		phoneNumber,
		email,
		userType
	} = req.body;

	if (!firstName) {
		return next(new ErrorResponse('Error', 400, ['first name is required']))
	}

	if (!lastName) {
		return next(new ErrorResponse('Error', 400, ['last name is required']))
	}

	if (!phoneNumber) {
		return next(new ErrorResponse('Error', 400, ['phone number is required']))
	}

	const talent = await User.create({
		firstName: firstName,
		lastName: lastName,
		phoneNumber: phoneNumber,
		email: email,
		userType: 'talent'
	})

	res.status(200).json({
		error: false,
		errors: [],
		data: talent,
		message: 'successful',
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



