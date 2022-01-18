import crypto from 'crypto';
import mongoose, { ObjectId, Model } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/error.util';
import { sendGrid } from '../utils/email.util';
import { asyncHandler, arrayIncludes, strIncludesEs6 } from '@btffamily/tmat'
import { generate } from '../utils/random.util';
import { userLogger } from '../config/wiston';
import { uploadBase64File } from '../utils/google.util'
import { validateWorks, addWorks } from '../services/work.srv'
import { validateEducation, addEducations } from '../services/education.srv'

import dayjs from 'dayjs'
import customparse from 'dayjs/plugin/customParseFormat';
dayjs.extend(customparse);

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

	const user = await User.findOne({ user: req.params.id });

	if(!user){
		return next(new ErrorResponse(`Error!`, 404, ['user does not exist']))
	}

	const { 
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
		currentSalary,
		resumeUrl,
		portfolioUrl,
		linkedinUrl,
		dribbleUrl,
		githubUrl 
	} = req.body;


	// validate languages (P & S)
	const pLang = await Language.findById(primaryLanguage);

	if(!pLang) {
		return next (new ErrorResponse('Error', 404, ['primary language does not exist']))
	}

	const sLang = await Language.findById(secondaryLanguage);
	
	if(!sLang) {
		return next (new ErrorResponse('Error', 404, ['secondary language does not exist']))
	}

	// validate frameworks
	const pFrame = await Framework.findById(primaryFramework);

	if(!pFrame) {
		return next (new ErrorResponse('Error', 404, ['primary framework does not exist']))
	}

	const sFrame = await Framework.findById(secondaryFramework);
	
	if(!sFrame) {
		return next (new ErrorResponse('Error', 404, ['secondary framework does not exist']))
	}

	// validate cloud platforms
	const pCloud = await Cloud.findById(primaryCloud);

	if(!pCloud) {
		return next (new ErrorResponse('Error', 404, ['primary cloud platform does not exist']))
	}

	const sCloud = await Cloud.findById(secondaryCloud);
	
	if(!sCloud) {
		return next (new ErrorResponse('Error', 404, ['secondary cloud platform does not exist']))
	}

	// check works
	if(!works){
		return next (new ErrorResponse('Error', 400, ['work data is rquired']))
	}

	if(typeof(works) !== 'object'){
		return next (new ErrorResponse('Error', 400, ['work data is required to be an array of object']))
	}

	if(works.length <= 0){
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

	if(educations.length <= 0){
		return next (new ErrorResponse('Error', 400, ['education data is required to contain valid object data']))
	}

	// works internal education
	const valEdu = await validateEducation(educations);

	if(valEdu.flag === false){
		return next (new ErrorResponse('Error', 400, [`${valEdu.message}`]));
	}


	const talent = await Talent.create({
		firstName: user.firstName,
		lastName: user.lastName,
		middleName,
		gender,
		location: location.label,
		address,
		type,
		band: 1,
		currentSalary,
		resumeUrl,
		portfolioUrl,
		linkedinUrl,
		dribbleUrl,
		githubUrl,
		user: user._id
	})

	// save skill
	const skill = await Skill.create({
		primaryLanguage,
		secondaryLanguage,
		primaryFramework,
		secondaryFramework,
		primaryCloud,
		secondaryCloud,
		user: user._id
	})

	// save other languages
	if(languages.length > 0){

		for(let i = 0; i < languages.length; i++){

			const lang = await Language.findById(languages[i]);

			if (lang){

				skill.languages.push(lang._id);
				await skill.save();

			}

		}

	}

	// save other frameworks
	if(frameworks.length > 0){

		for(let i = 0; i < frameworks.length; i++){

			const frame = await Framework.findById(frameworks[i]);

			if (frame){

				skill.frameworks.push(frame._id);
				await skill.save();

			}

		}

	}

	// save other clouds
	if(clouds.length > 0){

		for(let i = 0; i < clouds.length; i++){

			const cloud = await Framework.findById(clouds[i]);

			if (cloud){

				skill.clouds.push(cloud._id);
				await skill.save();

			}

		}

	}

	// save works
	await addWorks(works, user, talent);

	// save works
	await addEducations(educations, user, talent);


	res.status(200).json({
		error: false,
		errors: [],
		data: { _id: talent._id, firstName: talent.firstName, email: user.email, user: user._id, id: talent.id },
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



