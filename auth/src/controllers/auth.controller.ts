import crypto from 'crypto';
import mongoose, { ObjectId, Model } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/error.util';
import { sendGrid } from '../utils/email.util';
import { asyncHandler, strIncludesEs6, strToArrayEs6, isString } from '@btffamily/tmaapp'
import { generate } from '../utils/random.util';
import { userLogger } from '../config/wiston';
import { sendSMS } from '../utils/sms.util'

import dayjs from 'dayjs'
import customparse from 'dayjs/plugin/customParseFormat';
dayjs.extend(customparse);

// models
import User from '../models/User.model'
import Role from '../models/Role.model'
import Notification from '../models/Notification.model'
import Status from '../models/Status.model'

// nats 
import nats from '../events/nats';
import UserCreated from '../events/publishers/user-created';


declare global {
    namespace Express{
        interface Request{
            user?: any;
        }
    }
}


// @desc    Register User(Talent)
// @route   POST /api/identity/v1/auth/register
// @access  Public
export const registerTalent = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { firstName, lastName, email, password, phoneNumber, phoneCode, callback } = req.body;

    // find the user role
    const role = await Role.findOne({ name: 'user' });
    if(!role){
        return next(new ErrorResponse('An error occured. Please contact support.', 500, ['Roles not defined']));
    }

    // validate existing email
    const exist = await User.findOne({ email: email });
    if(exist){
        return next(new ErrorResponse('Error', 400, ['email already exist, use another email']));
    }

    // validate phone code
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

	// match user password with regex
	const match =  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
	const matched: boolean = match.test(password);

	if(!matched){
		return next(new ErrorResponse('Error', 400, ['password must contain at least 8 characters, 1 lowercase letter, 1 uppercase letter, 1 special character and 1 number']))
	}

    // create the user
    const user = await User.create({
		firstName,
		lastName,
        email,
        password,
		passwordType: 'self',
		savedPassword: password,
		phoneNumber: phoneStr + phoneNumber.substring(1),
		userType: 'talent',
        isSuper: false,
		isActivated: false,
		isAdmin: false,
		isTalent: true,
		isBusiness: false,
		isManager: false,
		isUser: true,
		isActive: true
    });

	// create status
	const status = await Status.create({
		profile: false,
		activated: false,
		apply: {
			status: false,
			step: 0
		},
		user: user._id,
		email: user.email
	});

	// attach the user role
	user.roles.push(role._id);
	user.status = status._id;
	await user.save();

	// attach the talent
	const tRole = await Role.findOne({ name: 'talent' });
	user.roles.push(tRole?._id);
	await user.save();

    // send emails, publish nats and initialize notification
    if(user){

        try {

            // send welcome email data
            let emailData = {
                template: 'welcome',
                email: email,
                preheaderText: 'welcome',
                emailTitle: 'Welcome to MYRIOI',
                emailSalute: `Hello ${user.firstName},`,
                bodyOne: 'We\'re glad you signed up on MYRIOI. Please login to your dashboard by clicking the button below',
                buttonUrl: `${callback}/login`,
                buttonText: 'Login to Dashboard',
                fromName: 'MYRIOI'
            }
            await sendGrid(emailData);

            // send activation email
            const activateToken = user.getActivationToken();
            await user.save({ validateBeforeSave: false });

            const activateUrl = `${callback}/${activateToken}`;

            let activateData = {
                template: 'welcome',
                email: email,
                preheaderText: 'activate account',
                emailTitle: 'Activate your account',
                emailSalute: `Hello ${user.firstName},`,
                bodyOne: 'Activate your MYRIOI account. Click the button below to activate your account',
                buttonUrl: `${activateUrl}`,
                buttonText: 'Activate Account',
                fromName: 'MYRIOI'
            }
            await sendGrid(activateData);

            const _user = await User.findById(user._id).populate([{ path: 'roles' }]);

            // send response to client
            res.status(200).json({
                error: false,
                errors: [],
                data: { 
                    email: _user?.email,
                    phoneNumber: _user?.phoneNumber,
                    phoneCode: phoneCode,
                    _id: _user?._id,
                    id: _user?.id
                },
                message: 'successful',
                status: 200
            })

            // publish nats
			await new UserCreated(nats.client).publish({ user: user, userType: user.userType, phoneCode: phoneCode });

            // create notification
            // const superadmin = await User.findOne({ email: 'hello@MYRIOI.com' });
            // const notiref = await generate(8, true);

            // await Notification.create({
            //     refId: notiref,
            //     body: `A new user ${user.email} just registered`,
            //     status: 'new',
            //     sender: {
            //         name: 'MYRIOI',
            //         id: superadmin ? superadmin._id : ''
            //     },
            //     recipients: [`${superadmin?._id}`]

            // });
            
        } catch (err) {
            return next(new ErrorResponse('Error', 500, [`${err}`]));
        }


    }else{
        return next(new ErrorResponse('Error', 500, ['an error occured. please contact support']));
    }

});

// @desc    Register User (third party business)
// @route   POST /api/identity/v1/auth/register/business
// @access  Public
export const registerBusiness = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {

	const { businessName, phoneCode, phoneNumber, email, password, callback } = req.body;
	const notiref = await generate(8, false);

	// find the default role first
	const role = await Role.findByName('business');
	if (!role) {
		return next(
			new ErrorResponse(
				"Error",
				500,
				['An error occured. Please contact admin for support']
			)
		);
	}

	//validate email
	const isExisting = await User.findOne({ email: email });
	if (isExisting) {
		return next(
			new ErrorResponse('Email already exist', 400, ['Email already exist. Please use another email'])
		);
	}

	if (!phoneNumber) {
		return next(
			new ErrorResponse('Phone number is required', 400, ['Phone number is required'])
		);
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

	// Create a new user
	const user = await User.create({
		firstName: businessName,
		lastName: businessName,
		email,
		password,
		passwordType: 'self',
		savedPassword: password,
		phoneNumber: phoneStr + phoneNumber.substring(1),
		phoneCode,
		userType: 'third-party',
		isSuper: false,
		isActivated: false,
		isAdmin: false,
		isTalent: false,
		isBusiness: true,
		isManager: false,
		isUser: true,
		isActive: true
	});

	// create status
	const status = await Status.create({
		profile: false,
		activated: false,
		user: user._id,
		email: user.email
	});

	// attach the 'business' role
	user.roles.push(role._id);
	user.status = status._id;
	await user.save();

	//send welcome email
	try {
		
		let emailData = {
			template: 'welcome',
			email: email,
			preheaderText: 'We are glad you signed up',
			emailTitle: 'Welcome to MYRIOI',
			emailSalute: `Hello ${user.firstName},`,
			bodyOne: "Welcome to MYRIOI, we're glad to have you.",
			buttonUrl: `${callback}/login`,
			buttonText: 'Login To Dashboard',
			fromName: 'MYRIOI'
		};
		await sendGrid(emailData);

		// send activation email
		const activateToken = user.getActivationToken();
		await user.save({ validateBeforeSave: false });

		const activateUrl = `${callback}/${activateToken}`;

		let activateData = {
			template: 'welcome',
			email: email,
			preheaderText: 'Verify your account ownership',
			emailTitle: 'Activate your account',
			emailSalute: `Hi ${user.firstName},`,
			bodyOne:'You just signed up on MYRIOI. Activate your account for you to have access to more features on your account. Click the button below to verify your account',
			buttonUrl: `${activateUrl}`,
			buttonText: 'Activate Account',
			fromName: 'MYRIOI'
		};

		await sendGrid(activateData);
	} catch (err) {
		return next(new ErrorResponse('Error', 500, ['Email could not be sent']));
	}

	const u = await User.findOne({ email: user.email});

	// publish natss
	await new UserCreated(nats.client).publish({ user: user, userType: user.userType, phoneCode: phoneCode });

	res.status(200).json({
		error: false,
		errors: [],
		message: `Successful`,
		data: { 
			email: u?.email,
			phoneNumber: u?.phoneNumber,
			phoneCode: phoneCode,
			_id: u?._id,
			id: u?.id
		},
		status: 200
	});

	// create the notification with superadmin attached
	// const superadmin = await User.findOne({email: 'hello@MYRIOI.com'});

	// await Notification.create({
	// 	refId: notiref,
	// 	body: `A new user ${user.email} just registered as a customer`,
	// 	status: 'new',
	// 	sender: {
	// 		name: 'MYRIOI',
	// 		id: `${superadmin?._id}`
	// 	},
	// 	recipients: [`${superadmin?._id}`]
	// });

})


// @desc        Login user 
// @route       POST /api/identity/v1/auth/login
// @access      Public
export const login = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {

	const { email, password } = req.body;

	// validate email and password
	if(!email || !password){
		return next(new ErrorResponse('invalid', 400, ['email is required', 'password is required']));
	}

	// check for user
	const user = await User.findOne({ email: email }).select('+password +passwordType');

	if(!user){
		return next(new ErrorResponse('Invalid credentials', 403, ['invalid credentials']))
	}

	if(user.isLocked){
		return next(new ErrorResponse('Error!', 403, ['account currently locked for 24 hours']))
	}

	if(!user.isActive){
		return next(new ErrorResponse('Error!', 403, ['account currently deactivated. please contact support']))
	}

	// check password
	const isMatched = await user.matchPassword(password);

	if(!isMatched || (user && !isMatched)){

		// increase login limit
		if(user.loginLimit as number < 3){

			user.loginLimit = user.increaseLoginLimit()
			await user.save();
		}

		// lock user account if not locked
		if(user.loginLimit >= 3 && !user.checkLockedStatus()){
			user.isLocked = true;
			await user.save();

			return next(new ErrorResponse('Forbidden', 403, ['account currently locked for 24 hours. Contact support']))
		}

		// return locked 
		if((user.loginLimit === 3 || user.loginLimit > 3) && user.checkLockedStatus()){
			return next(new ErrorResponse('Forbidden!', 403, ['account currently locked for 24 hours. Contact support']));
		}

		return next(new ErrorResponse('Invalid credentials', 403, ['invalid credentials']))
	}

	if(user.loginLimit > 0){
		
		user.loginLimit = 0;
		user.isLocked = false;
		await user.save();

	}

	// save request user object
	req.user = user;

	const message = 'successful';
	sendTokenResponse(user, message, 200, res);

})

// @desc        Force change password 
// @route       POST /api/identity/v1/auth/force-password
// @access      Public
export const forcePassword = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {

    const { email, password } = req.body;

	if(!password || !email){
		return next(new ErrorResponse('Error!', 404, ['password is required', 'email is required']));
	}

	const user = await User.findOne({ email: email });

	if(!user){
		return next(new ErrorResponse('Error', 404, ['user does not exist']));
	}

	if(user.passwordType !== 'generated'){
		return next(new ErrorResponse('Error', 403, ['password is self generated or self-changed']));
	}

	// match user password with regex
	const match =  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
	const matched: boolean = match.test(password);

	if(!matched){
		return next(new ErrorResponse('Error', 400, ['password must contain at least 8 characters, 1 lowercase letter, 1 uppercase letter, 1 special character and 1 number']))
	}

	user.password = password;
    user.passwordType = 'self-changed';
	user.savedPassword = password;
    await user.save();

	res.status(200).json({
        error: false,
        errors: [],
        data: null,
        message: 'successful',
        status: 200
    })

	//TODO: send password changed email

})

// @desc        Logout user
// @route       POST /api/identity/v1/auth/logout
// @access      Public
export const logout = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {

	res.cookie('token', 'none', {
		expires: new Date(Date.now() + 10 + 1000),
		httpOnly: true
	});

	res.status(200).json({
		error: false,
		errors: [],
		data: null,
		message: 'Logout successful',
		status: 200,
	});

})

// @desc        Get logged in user
// @route       POST /api/identity/v1/auth/user/:id
// @access      Private
export const getUser = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {

	const user = await User.findById(req.params.id);

	if(!user){
		return next(new ErrorResponse('Cannot find user', 401, [`Cannot find user`]));
	}

	const _user = await User.findOne({ _id: user._id}).populate([ { path: 'roles', select: '_id name', } ]);

	res.status(200).json({
		error: false,
		errors: [],
		data: _user,
		message: 'success',
		status: 200,
	});

})

// @desc        change user password (with verification)
// @route       POST /api/identity/v1/auth/change-password/:id
// @access      Private
export const updatePassword = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {

	const { currentPassword, newPassword, code } = req.body;
	const user = await User.findById(req.params.id).select('+password');

	if(!user){
		return next(new ErrorResponse('Not found', 404, ['user does not exist']));
	}

	// validate currentPassword
	if(!currentPassword){
		return next(new ErrorResponse('Error', 400, ['currentPassword is required']));
	}

	// validate newPassword
	if(!newPassword){
		return next(new ErrorResponse('Error', 400, ['newPassword is required']));
	}

	// validate verification code
	if(!code && !user.isSuper){

		const mailCode = await generate(6, false);

		let emailData = {
			template: 'email-verify',
			email: user.email,
			preheaderText: 'Verify your email',
			emailTitle: 'Email Verification',
			emailSalute: `Hi ${user.firstName}`,
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

		const isMatched = user.matchPassword(user.password);

		if(!isMatched){
			return next(new ErrorResponse('Error', 403, ['invalid current password']))
		}

		user.emailCode = undefined;
		user.emailCodeExpire = undefined;
		user.password = newPassword;
		await user.save();

		res.status(200).json({
			error: false,
			errors: [],
			data: null,
			message: 'successful',
			status: 200,
		});

	}

});

// @desc        Send reset password link
// @route       POST /api/identity/v1/auth/forgot-password
// @access      Public
export const sendResetLink = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {

	const { email, callback } = req.body;

	if(!email && !callback){
		return next(new ErrorResponse('Error!', 400, ['email is required', 'callback is required']))
	}

	if(!email){
		return next(new ErrorResponse('Error!', 400, ['email is required']))
	}

	if(!callback){
		return next(new ErrorResponse('Error!', 400, ['callback is required']))
	}

	const user = await User.findOne({ email: email})

	if (!user) {
		return next(new ErrorResponse('Error', 404, ['email does not exist']));
	}

	// Get reset token
	const resetToken = user.getResetPasswordToken();
	await user.save({ validateBeforeSave: false });

	try {

		const resetUrl = `${callback}/${resetToken}`;

		let emailData = {
			template: 'welcome',
			email: user.email,
			preheaderText: 'change password',
			emailTitle: 'Reset your password',
			emailSalute: `Hello ${user.firstName},`,
			bodyOne:
			'You are receiving this email because you (or someone else) has requested the reset of your password. Click the button below to change your password or ignore this email if this wasn\'t you.',
			buttonUrl: `${resetUrl}`,
			buttonText: 'Change Password',
			fromName: 'MYRIOI'
		};

		await sendGrid(emailData);

		res.status(200).json({
			error: false,
			errors: [],
			data: null,
			message: `Sent reset link to ${user.email}`,
			status: 200,
		});
		
	} catch (err) {

		user.resetPasswordToken = undefined;
		user.resetPasswordTokenExpire = undefined;

		await user.save({ validateBeforeSave: false });

		return next(new ErrorResponse('error!', 500, ['could not send email. Please try again']));
		
	}

})

// @desc        Reset user password
// @route       POST /api/identity/v1/auth/reset-password
// @access      Public
export const resetPassword = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {

	const token = req.params.token;
    const { password } = req.body;

	if(!password){
        return next(new ErrorResponse('Error', 400, ['new \'password\' is required']))
    }

	const hashed = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

	// const user = await User.findOne({ resetPasswordToken: hashed, resetPasswordTokenExpire: { $gt: new Date() }});
	const user = await User.findOne({ resetPasswordToken: hashed });

	if(!user){
		return next(new ErrorResponse('error', 404, ['invalid token']));
	}

	const nd = dayjs(user.resetPasswordTokenExpire); // expire date
	const td = dayjs(); // today
	const diff = td.get('minutes') - nd.get('minutes');
	
	if(user && diff > 10 ){
		return next(new ErrorResponse('error', 404, ['invalid token']))
	}

	// match user password with regex
	const match =  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
	const matched: boolean = match.test(password);

	if(!matched){
		return next(new ErrorResponse('Error', 400, ['password must contain at least 8 characters, 1 lowercase letter, 1 uppercase letter, 1 special character and 1 number']))
	}

	user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save();

	res.status(200).json({
        error: false,
        errors: [],
        data: null,
        message: 'successful',
        status: 200
    })

	//TODO: send password changed email

})

// @desc        Activate account
// @route       POST /api/identity/v1/auth/activate-account
// @access      Public
export const activateAccount = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {

	const token = req.params.token;

	const hashed = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

	const user = await User.findOne({activationToken: hashed, activationTokenExpire: {$gt: new Date() }});

	if(!user){
        return next(new ErrorResponse('error!', 403, ['invalid token']))
    }

	user.isActivated = true;
    user.activationToken = undefined;
    user.activationTokenExpire = undefined;
	await user.save();

	// update status
	const stat = await Status.findOne({ user: user._id });

	if(stat){

		stat.activated = true;
		await stat.save()

	}else{

		await Status.create({
			activated: true,
			user: user._id
		});

	}

	res.status(200).json({
        error: false,
        errors: [],
        data: null,
        message: 'account activated',
        status: 200
    })

})

// @desc        Attach role to a user
// @route       POST /api/identity/v1/auth/attach-role/:id
// @access      Private
export const attachRole = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {

	// find the roles
	let roleNames: Array<string> = [], roleIds: Array<string | any> = [];

	const { roles } = req.body;

	if (!isString(roles)){
		return next(new ErrorResponse('error', 400, ['expected roles to be a string separated by commas or spaces']));
	}

	const user = await User.findById(req.params.id);

	if (!user) {
		return next(new ErrorResponse('error!', 404, ['user does not exist']));
	}

	// eslint-disable-next-line prettier/prettier
	if (strIncludesEs6(roles, ',')) {
		roleNames = strToArrayEs6(roles, ',');
	} else if (strIncludesEs6(roles, ' ')) {
		roleNames = strToArrayEs6(roles, ' ');
	} else {
		roleNames.push(roles);
	}

	// get the role objects and extract the IDs
	// may need to refactor this using es6
	for (let j = 0; j < roleNames.length; j++) {

		let role = await Role.findByName(roleNames[j]);

		if (!role) {
			return next(new ErrorResponse('Error', 404, ['role does not exist']));
		}

		roleIds.push(role._id);
	}

	// check if user already has one of the role(s) specified.
	for (let m = 0; m < roleNames.length; m++) {

		const has = await user.hasRole(roleNames[m], user.roles);

		if (!has) {
			continue;
		} else {
			return next(new ErrorResponse('Error!', 404, ['user is already attached to one of the role(s) specified']));
		}

	}

	// set the data --- add the new role(s) specified;
	for(let n: number = 0; n < roleIds.length; n++){
		user.roles.push(roleIds[n]);
	}
	await user.save();

	res.status(200).json({
		error: false,
		errors: [],
		data: null,
		message: `successful`,
		status: 200,
	});

})

// @desc        Detach role from a user
// @route       POST /api/identity/v1/auth/detach-role/:id
// @access      Private
export const detachRole = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {

	let uRoles: Array<any> = [];
	let flag: boolean = true;

	const { roleName } = req.body;

	if(!roleName || !isString(roleName)){
		return next(new ErrorResponse('error!', 404, ['role is required and expected to be a string']))
	}

	// find the role
	const role = await Role.findByName(roleName);

	if (!role) {
		return next(new ErrorResponse('error', 404, ['role does not exist']));
	}

	const user = await User.findById(req.params.id);

	if (!user) {
		return next(new ErrorResponse('error!', 404, ['user does not exist']));
	}

	// check if user already has one of the role(s) specified.
	for (let m = 0; m < user.roles.length; m++) {

		if (user.roles[m].toString() === role._id.toString()) {

			flag = true;
			uRoles = user.roles.filter((r) => r.toString() !== role._id.toString());
			break;

		} else {

			flag = false;
			continue;

		}
	}

	if(!flag){
        return next(new ErrorResponse('Error', 404, ['user does not have the role specified']))
    }

	// set the data
	user.roles = uRoles;
	await user.save();

	res.status(200).json({
        error: false,
        errors: [],
        data: null,
        message: 'successful',
        status: 200
    })

})

// Helper function: get token from model, create cookie and send response
const sendTokenResponse = async (user: any, message: string, statusCode: number, res: Response): Promise<void> => {

	let result: any;

	// create token
	const token = user.getSignedJwtToken();

	const options = {
		expires: new Date(
			Date.now() + 70 * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
		secure: false
	};

	// make cookie work for https
	if (process.env.NODE_ENV === 'production') {
		options.secure = true;
	}

	const u = await User.findOne({ email: user.email }).populate({
		path: 'roles',
		select: '_id name',
	});

	const status = await Status.findOne({ user: user._id });

	if(!status){
		result = {
			profile: false,
			apply: {
				status: false,
				step: 0
			},
			activated: false
		}
	}else{
		result = {
			profile: status.profile ? status.profile  : false,
			apply: {
				status: status.apply.status,
				step: status.apply.step
			},
			activated: status.activated ? status.activated : false
		};
	}

	const userData = {
		_id: u?._id,
		email: u?.email,
		roles: u?.roles,
		phoneNumber: u?.phoneNumber,
		id: u?.id,
		isSuper: u?.isSuper,
		isActivated: u?.isActivated,
		isAdmin: u?.isAdmin,
		isTalent: u?.isTalent,
		isManager: u?.isManager,
		isBusiness: u?.isBusiness,
		isUser: u?.isUser,
		isActive: u?.isActive,
		passwordType: u?.passwordType,
		status: result
	}

	res.status(statusCode).cookie('token', token, options).json({
		error: false,
		errors: [],
		message: message,
		token: token,
		data: userData,
		status: 200
	});
};


/** 
 * snippet
 * **/

// @desc        Login user (with verification)
// @route       POST /api/identity/v1/auth/login
// @access      Public
// export const funcd = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {

// })