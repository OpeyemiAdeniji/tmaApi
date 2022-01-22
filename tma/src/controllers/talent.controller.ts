import crypto from 'crypto';
import mongoose, { ObjectId, Model } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/error.util';
import { sendGrid } from '../utils/email.util';
import { asyncHandler, arrayIncludes, strIncludesEs6 } from '@btffamily/tmaapp'
import { generate } from '../utils/random.util';
import { userLogger } from '../config/wiston';
import { uploadBase64File } from '../utils/google.util'
import { validateWorks, addWorks } from '../services/work.srv'
import { validateEducation, addEducations } from '../services/education.srv'

import dayjs from 'dayjs'
import customparse from 'dayjs/plugin/customParseFormat';
dayjs.extend(customparse);

import nats from '../events/nats';
import TalentApplied from '../events/publishers/talent-applied';




// models
import User from '../models/User.model'
import Talent from '../models/Talent.model'
import Language from '../models/Language.model'
import Work from '../models/Work.model'
import Skill from '../models/Skill.model'
import Education from '../models/Education.model'
import Framework from '../models/Framework.model';
import Cloud from '../models/Cloud.model';


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
	
	const talent = await Talent.findOne({ user: req.params.id }).populate([
		{ path: 'user', select: '_id userId email' }, 
		{path: 'businesses', select: '_id name websiteUrl'},
		{ path: 'works' },
		{ path: 'educations' },
		{ path: 'skill' }
	])

	if(!talent){
		return next(new ErrorResponse(`Error!`, 404, ['talent does not exist']))
	}

	res.status(200).json({
		error: false,
		errors: [],
		data: talent,
		message: `successful`,
		status: 200
	});

})

// @desc    Talent application
// @route   POST /api/v1/talents/apply/:id
// @access  Private/Superadmin/Admin
export const apply = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {

	const user = await User.findById(req.params.id);

	if(!user){
		return next(new ErrorResponse(`Error!`, 404, ['user does not exist']))
	}

	const existing = await Talent.findOne({user: user._id});

	if(existing){
		return next(new ErrorResponse(`Error!`, 400, ['talent profile already exist']))
	}

	const { 
		applyStep,
		bio,
		primaryLanguage, 
		secondaryLanguage,
		primaryFramework, 
		secondaryFramework,
		primaryCloud, 
		secondaryCloud,
		languages,
		frameworks,
		clouds,
		works,
		educations,
		middleName,
		gender,
		location,
		address,
		type,
		level,
		currentSalary,
		resumeUrl,
		portfolioUrl,
		linkedinUrl,
		dribbleUrl,
		githubUrl 
	} = req.body;


	// // validate languages (P & S)
	const pLang = await Language.findOne({ name: primaryLanguage });

	if(!pLang) {
		return next (new ErrorResponse('Error', 404, ['primary language does not exist']))
	}

	const sLang = await Language.findOne({ name: secondaryLanguage  });
	
	if(!sLang) {
		return next (new ErrorResponse('Error', 404, ['secondary language does not exist']))
	}

	// validate frameworks
	const pFrame = await Framework.findOne({ name: primaryFramework });

	if(!pFrame) {
		return next (new ErrorResponse('Error', 404, ['primary framework does not exist']))
	}

	const sFrame = await Framework.findOne({ name: secondaryFramework});
	
	if(!sFrame) {
		return next (new ErrorResponse('Error', 404, ['secondary framework does not exist']))
	}

	// validate cloud platforms
	const pCloud = await Cloud.findOne({ name: primaryCloud });

	if(!pCloud) {
		return next (new ErrorResponse('Error', 404, ['primary cloud platform does not exist']))
	}

	const sCloud = await Cloud.findOne({ name: secondaryCloud });
	
	if(!sCloud) {
		return next (new ErrorResponse('Error', 404, ['secondary cloud platform does not exist']))
	}

	// check works
	if(!works){
		return next (new ErrorResponse('Error', 400, ['work data is rquired']))
	}

	if(typeof(works) !== 'object'){
		return next (new ErrorResponse('Error', 400, ['work data is required to be an array of objects']))
	}

	if(!works.length && works.length <= 0){
		return next (new ErrorResponse('Error', 400, ['work data is required to contain valid object data']))
	}

	// works internal validation
	const valWork = await validateWorks(works);

	if(valWork.flag === false){
		return next (new ErrorResponse('Error', 400, [`${valWork.message}`]));
	}

	// check education
	if(!educations){
		return next (new ErrorResponse('Error', 400, ['education data is rquired']))
	}

	if(typeof(educations) !== 'object'){
		return next (new ErrorResponse('Error', 400, ['education data is required to be an array of object']))
	}

	if(!educations.length && educations.length <= 0){
		return next (new ErrorResponse('Error', 400, ['education data is required to contain valid object data']))
	}

	// works internal education
	const valEdu = await validateEducation(educations);

	if(valEdu.flag === false){
		return next (new ErrorResponse('Error', 400, [`${valEdu.message}`]));
	}

	

	// save works
	// await addWorks(works, user, talent);

	// save works
	// await addEducations(educations, user, talent);

	await new TalentApplied(nats.client).publish({ talent: null, user: user, step: applyStep });


	res.status(200).json({
		error: false,
		errors: [],
		data: { },
		message: `successful`,
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



