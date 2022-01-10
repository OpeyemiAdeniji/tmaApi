import crypto from 'crypto';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Stan } from 'node-nats-streaming';
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/error.util';
import { asyncHandler, strIncludesEs6, strToArrayEs6 } from '@btffamily/concreapt';
import { sendGrid } from '../utils/email.util';

import Language from '../models/Language.model';
import { generate } from '../utils/random.util';

// @desc    Get All Languages
// @route   GET /api/identity/v1/languages
// access   Public
export const getLanguages = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	res.status(200).json(res.advancedResults);
})

// @desc    Get A Language
// @route   GET /api/identity/v1/language/:id
// access   Public
export const getLanguage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	
	const lang = await Language.findById(req.params.id)

    if(!lang){
        return next(new ErrorResponse('Cannot find language', 404, ['Cannot find language']))
    }

    res.status(200).json({
        error: false,
        errors: [],
        data: lang,
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