import express, { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/error.util';
import { asyncHandler } from '@btffamily/tmaapp';
import { sendGrid } from '../utils/email.util';

import User from '../models/User.model';
import { generate } from '../utils/random.util'


// @desc    send welcome email to user
// @route   POST /api/identity/v1/emails/welcome/:id
// @access  Private
export const sendWelcomeEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { email, callbackUrl } = req.body;

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorResponse('Error', 404, ['user does not exist']));
    }

    if(!email){
        return next(new ErrorResponse('Error', 400, ['email is required']));
    }

    if(!callbackUrl){
        return next(new ErrorResponse('Error', 400, ['callbackUrl is required']));
    }

    if(user.email !== email){
        return next(new ErrorResponse('Error', 400, ['email does not belong to user']));
    }

    try {

        let emailData = {
            template: 'welcome',
            email: email,
            preheaderText: 'welcome',
            emailTitle: 'Welcome to MYRIOI',
            emailSalute: `Hello, ${user.firstName}`,
            bodyOne: 'Welcome to MYRIOI, we\'re glad you joined us.',
            buttonUrl: `${callbackUrl}`,
            buttonText: 'Login To Dashboard',
            fromName: 'MYRIOI'
        }

        await sendGrid(emailData);

        res.status(200).json({
            error: false,
            errors: [],
            data: null,
            message: 'successful',
            status: 200
        })
        
    } catch (err) {

        return next(new ErrorResponse('Error', 500, [`There was an error ${err}. Contact support`]))
        
    }

})


// @desc    send activation email
// @route   POST /api/identity/v1/emails/activate/:id
// @access  Private
export const sendActivationEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { email, callbackUrl } = req.body;

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorResponse('Error', 404, ['user does not exist']));
    }

    if(!callbackUrl){
        return next(new ErrorResponse('Error', 400, ['callbackUrl is required']));
    }

    if(!email){
        return next(new ErrorResponse('Error', 400, ['email is required']));
    }
    
    if(user.email !== email){
        return next(new ErrorResponse('Error', 400, ['email does not belong to user']));
    }

    // generate activation token
    const activationToken = user.getActivationToken();
    await user.save({ validateBeforeSave: false });

    // generate activation url
    const activationUrl = `${callbackUrl}/${activationToken}`;

    let emailData = {
        template: 'welcome',
        email: email,
        preheaderText: 'activate',
        emailTitle: 'Verify your account',
        emailSalute: `Hello, ${user.firstName}`,
        bodyOne: 'Please confirm that you own this email by clicking the button below',
        buttonUrl: `${activationUrl}`,
        buttonText: 'Login To Dashboard',
        fromName: 'MYRIOI'
    }

    await sendGrid(emailData);

    user.isActivated = false;
    user.activationToken = activationToken;
    user.activationTokenExpire = (Date.now() + 5 * 60 * 1000 as unknown) as Date;
    await user.save();

    res.status(200).json({
        error: false,
        errors: [],
        data: null,
        message: 'successful',
        status: 200
    });


})


// @desc    send forgot password email
// @route   POST /api/identity/v1/emails/forgot-password
// @access  Public
export const sendResetLink = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { email, callbackUrl } = req.body;

    if(!email && !callbackUrl){
        return next(new ErrorResponse('Error', 400, ['email is required', 'callbackUrl is required']));
    }

    if(!email){
        return next(new ErrorResponse('Error', 400, ['email is required']));
    }

    if(!callbackUrl){
        return next(new ErrorResponse('Error', 400, ['callbackUrl is required']));
    }

    const user = await User.findOne({email: email });

    if(!user){
        return next(new ErrorResponse('Error', 404, ['email does not exist']));
    }


    // generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // generate activation url
    const resetUrl = `${callbackUrl}/${resetToken}`;

    let emailData = {
        template: 'welcome',
        email: email,
        preheaderText: 'reset password',
        emailTitle: 'Reset your password',
        emailSalute: `Hello, ${user.firstName}`,
        bodyOne: 'You are receiving this email because you (or someone else) has requested a password reset. Click the button below to change your password or ignore this email if this wasnt you',
        buttonUrl: `${resetUrl}`,
        buttonText: 'Reset Password',
        fromName: 'MYRIOI'
    }

    await sendGrid(emailData);

    res.status(200).json({
        error: false,
        errors: [],
        data: null,
        message: 'successful',
        status: 200
    });


})


// @desc    send email verification code
// @route   POST /api/identity/v1/emails/send-email-code
// @access  Public
export const sendVerificationEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { email } = req.body;

    if(!email){
        return next( new ErrorResponse('Error', 400, ['email is required']))
    }

    const user = await User.findOne({email: email});

    if(!user){
        return next( new ErrorResponse('Error', 404, ['email does not exist']))
    }

    const mailCode = await generate(6, false);

    let emailData = {
        template: 'email-verify',
        email: email,
        preheaderText: 'verify email',
        emailTitle: 'Email verification',
        emailSalute: `Hello, ${user.firstName}`,
        bodyOne: 'Use the code below to verify your email',
        bodyTwo: `${mailCode}`,
        fromName: 'MYRIOI'
    }
    await sendGrid(emailData);

    user.emailCode = mailCode.toString();
    user.emailCodeExpire = (Date.now() + 5 * 60 * 1000 as unknown) as Date
    await user.save();

    res.status(200).json({
        error: false,
        errors: [],
        data: null,
        message: 'successful',
        status: 200
    })


})