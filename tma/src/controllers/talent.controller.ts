import crypto from 'crypto';
import mongoose, { ObjectId, Model } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/error.util';
import fs from 'fs';
import { sendGrid } from '../utils/email.util';
import { asyncHandler, arrayIncludes, strIncludesEs6 } from '@btffamily/tmaapp'
import { saveParsed } from '../services/talent.sv'
import { parseToJson } from "../utils/csv.util";
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
import Tool from '../models/Tool.model';
import Category from '../models/Category.model';

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

	const { 
		applyStep,
		firstName,
		lastName,
		middleName,
		bio,
		primarySkill,
		primaryLanguage,
		primaryFramework,
		primaryCloud,
		tools,
		languages,
		frameworks,
		clouds,
		skills,
	} = req.body;

	const user = await User.findById(req.params.id);

	if(!user){
		return next(new ErrorResponse(`Error!`, 404, ['user does not exist']))
	}

	if(!applyStep) {
		return next (new ErrorResponse('Error', 404, ['talent application step is required']))
	}

	// // validate languages (P & S)
	let pSkill: any;
	pSkill = await Skill.findOne({ shortCode: primarySkill });

	if(applyStep <= 1 && !pSkill) {

		pSkill = await Category.findOne({ code: primarySkill });
		
		if(!pSkill){
			return next (new ErrorResponse('Error', 404, ['skill does not exist']))
		}

	}

	// // validate language
	const pLang = await Language.findOne({ name: primaryLanguage.name });

	if(applyStep <= 1 && primaryLanguage.name && !pLang) {
		return next (new ErrorResponse('Error', 404, ['language does not exist']))
	}

	// validate frameworks
	const pFrame = await Framework.findOne({ name: primaryFramework.name });

	if(applyStep <= 1 && primaryFramework.name && !pFrame) {
		return next (new ErrorResponse('Error', 404, ['framework does not exist']))
	}

	// validate cloud platforms
	const pCloud = await Cloud.findOne({ name: primaryCloud.name });

	if(applyStep <= 1 && primaryCloud.name && !pCloud) {
		return next (new ErrorResponse('Error', 404, ['cloud platform does not exist']))
	}


	if(applyStep <= 1){

		const talent = await Talent.create({ 

			applyStep: applyStep,
			firstName: firstName ? firstName : user.firstName,
			lastName: lastName ? lastName : user.lastName,
			middleName: middleName ? middleName : '',
			bio,
			primarySkill: pSkill._id,
			pLanguage: { type: pLang?._id, strength: primaryLanguage.strength },
			pFramework: { type: pFrame?._id, strength: primaryFramework.strength },
			pCloud: { type: pCloud?._id, strentgh: primaryCloud.strength }
		});


		// save skills
		if(skills.length){

			for(let i = 0; i < skills.length; i++){

				const skill = await Skill.findOne({ shortCode: skills[i] });
	
				if (skill){
	
					talent.skills.push(skill._id);
					await talent.save();
	
				}
	
			}

		}

		// save tools
		if(tools.length){

			for(let i = 0; i < tools.length; i++){

				const tool = await Tool.findOne({ name: tools[i] });
	
				if (tool){
	
					talent.tools.push(tool._id);
					await talent.save();
	
				}
	
			}

		}

		// save other languages
		if(languages.length > 0){

			for(let i = 0; i < languages.length; i++){

				const lang = await Language.findOne({ code: languages[i].code });

				if (lang){

					talent.languages.push({ type: lang._id, strength: languages[i].strength });
					await talent.save();

				}

			}

		}

		// save other frameworks
		if(frameworks.length > 0){

			for(let i = 0; i < frameworks.length; i++){

				const frame = await Framework.findOne({ name: frameworks[i].name });

				if (frame){

					talent.frameworks.push({ type: frame._id, strength: frameworks[i].strength });
					await talent.save();

				}

			}

		}
		
		// save other clouds
		if(clouds.length > 0){

			for(let i = 0; i < clouds.length; i++){

				const cloud = await Cloud.findOne({ code: clouds[i].code });

				if(cloud){

					talent.clouds.push({ type: cloud._id, strength: clouds[i].strength });
					await talent.save();

				}

			}

		}

		talent.applyStep = talent.applyStep + 1;
		await talent.save();

		await new TalentApplied(nats.client).publish({ talent: talent, user: user, step: applyStep + 1 });

		res.status(200).json({
			error: false,
			errors: [],
			data: talent,
			message: `successful`,
			status: 200
		});


	}
	


	if(applyStep > 1){

		const talent = await Talent.findOne({user: user._id});

		if(!talent){
			return next (new ErrorResponse('Error', 404, ['application process should start from step 1']));
		}


		if(applyStep === 2){



		}

		if(applyStep === 3){

			

		}

		if(applyStep === 4){

			

		}

		// save works
		// await addWorks(works, user, talent);

			
			talent.applyStep = talent.applyStep + 1;
			await talent.save();

			await new TalentApplied(nats.client).publish({ talent: talent, user: user, step: applyStep + 1 });

			res.status(200).json({
				error: false,
				errors: [],
				data: talent,
				message: `successful`,
				status: 200
			});

		
		talent.applyStep = talent.applyStep + 1;
		await talent.save();

		await new TalentApplied(nats.client).publish({ talent: talent, user: user, step: applyStep + 1 });

		res.status(200).json({
			error: false,
			errors: [],
			data: talent,
			message: `successful`,
			status: 200
		});


	}


	

	

	


	res.status(200).json({
		error: false,
		errors: [],
		data: { },
		message: `successful`,
		status: 200
	});

})

// @desc    Upload Talent
// @route   PUT /api/v1/talents/upload/:id
// @access  Private/Superadmin/Admin
export const uploadTalent = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

	const user = req.params.id;

	if(!user){
		return next(new ErrorResponse('Error!', 404, ['user does not exist']));
	}

	if(!req.files){
		return next(new ErrorResponse('Error!', 400, ['please upload a file']));
	}

	const file : any = req.files.file;

	// make sure the file is a csv file
	if(file.mimetype !== 'text/csv'){
		return next(new ErrorResponse('Error', 400, ['please upload a valid csv file']))
	}

	// get file path
	const filePath = file.tempFilePath;

	const data = await parseToJson(filePath);

	// delete tmp file created
	const tmpFolder = filePath;
	await fs.rmSync(tmpFolder, { recursive: true })

	// check if file does not contain any data
	if(data.length <= 0 || data === undefined || data === null){
		return next(new ErrorResponse('Error', 400, ['file does not contain any data']));
	}

	// save all data
	const saved = await saveParsed(data, user)

	if(saved && saved.flag === false){
		return next(new ErrorResponse('Error', 400, [`${saved.message}`]));
	}

	res.status(200).json({
		error: false,
		errors: [],
		count: saved?.result.length,
		data: saved?.result,
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