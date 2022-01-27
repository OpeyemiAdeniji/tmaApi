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
import Business from '../models/Business.model';
import Preselect from '../models/Preselect.model';

// @desc           Get all talents
// @route          GET /api/v1/talents
// @access         Private
export const getTalents = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {
	res.status(200).json(res.advancedResults);   	
})

// @desc           Get all talents
// @route          GET /api/v1/talents/get-talent
// @access         Private
export const getAllTalents = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

	const users = await User.find({ userType: 'talent'});

	// find talents
	let results: Array<any> = [];

	for(let i = 0; i < users.length; i++){

		const talent = await Talent.findOne({ user: users[i]._id});

		if(talent){

			results.push({ talent: talent, user: users[i]});
		}

	}

	res.status(200).json({
		error: false,
		errors: [],
		total: results.length,
		data: results,
		message: 'successful',
		status: 200
	})
})

// @desc    Get a talent
// @route   GET /api/v1/talents/:id
// @access  Private/Superadmin/Admin
export const getTalent = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {
	
	const talent = await Talent.findOne({ user: req.params.id }).populate([
		{ path: 'user', select: '_id userId email' }, 
		{path: 'matchedBusinesses', select: '_id name websiteUrl'},
		{path: 'currentlyMatched', select: '_id name websiteUrl'},
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
		works, 
		educations,
		currentSalary,
		gender,
		resume,
		jobType,
		workType,
		workCategory
	} = req.body;

	const user = await User.findById(req.params.id);

	if(!user){
		return next(new ErrorResponse(`Error!`, 404, ['user does not exist']))
	}

	if(!applyStep) {
		return next (new ErrorResponse('Error', 404, ['talent application step is required']))
	}

	if(applyStep === 1){


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

		if(primaryLanguage.name && !pLang) {
			return next (new ErrorResponse('Error', 404, ['language does not exist']))
		}

		// validate frameworks
		const pFrame = await Framework.findOne({ name: primaryFramework.name });

		if(primaryFramework.name && !pFrame) {
			return next (new ErrorResponse('Error', 404, ['framework does not exist']))
		}

		// validate cloud platforms
		const pCloud = await Cloud.findOne({ name: primaryCloud.name });

		if(primaryCloud.name && !pCloud) {
			return next (new ErrorResponse('Error', 404, ['cloud platform does not exist']))
		}

		const talent = await Talent.create({ 

			applyStep: applyStep,
			firstName: firstName ? firstName : user.firstName,
			lastName: lastName ? lastName : user.lastName,
			middleName: middleName ? middleName : '',
			bio,
			primarySkill: pSkill._id,
			pLanguage: { type: pLang?._id, strength: primaryLanguage.strength },
			pFramework: { type: pFrame?._id, strength: primaryFramework.strength },
			pCloud: { type: pCloud?._id, strentgh: primaryCloud.strength },
			email: user.email,
			user: user._id
			
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
			return next (new ErrorResponse('Error', 400, ['application process should start from step 1']));
		}


		if(applyStep === 2){

			if(!works){
				return next (new ErrorResponse('Error', 400, ['work data is required']));
			}

			if(typeof(works) !== 'object' || works.length <= 0){
				return next (new ErrorResponse('Error', 400, ['work data is required to be anarray of data']));
			}

			const wValidate = await validateWorks(works);

			if(wValidate.flag === false){
				return next (new ErrorResponse('Error', 400, [`${wValidate.message}`]));
			}

			if(educations && typeof(educations) === 'object' && educations.length > 0){

				const eValidate = await validateEducation(educations);

				if(eValidate.flag === false){
					return next (new ErrorResponse('Error', 400, [`${eValidate.message}`]));
				}

			}

			// save works
			await addWorks(works, user, talent);

			// save educations
			await addEducations(educations, user, talent);


			talent.applyStep = talent.applyStep + 1;
			talent.currentSalary.value = currentSalary && currentSalary.value ? currentSalary.value : 0;
			talent.currentSalary.currency = currentSalary && currentSalary.currency ? currentSalary.currency : '';
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

		if(applyStep === 3){

			talent.firstName = firstName;
			talent.lastName = lastName;
			talent.middleName = middleName;
			talent.gender = gender;
			await talent.save();

			const mime = resume.split(';base64')[0].split(':')[1];

			if(!mime || mime === '') {
				return next(new ErrorResponse(`invalid format`, 400, ['resume data is is expected to be base64 string']));
			}

			// upload file
			const fileData = {
				file: resume,
				filename: user.email + '-' + 'resume',
				mimeType: mime
			}

			const gData = await uploadBase64File(fileData);
			talent.resumeUrl = gData.publicUrl;
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

		if(applyStep === 4){

			if(!jobType){
				return next(new ErrorResponse(`Error`, 400, ['job type is reqiuired']));
			}

			if(!workCategory){
				return next(new ErrorResponse(`Error`, 400, ['work category is reqiuired']));
			}

			if(!workCategory.type){
				return next(new ErrorResponse(`Error`, 400, ['work category is reqiuired']));
			}

			if(!workCategory.availability && workCategory.type == 'part-time'){
				return next(new ErrorResponse(`Error`, 400, ['work availability is reqiuired']));
			}

			talent.jobType = jobType;
			talent.workType = workType ? workType : 'contract';
			talent.workCategory.type = workCategory.type;
			talent.workCategory.availability = workCategory.availability;
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

		if(applyStep >= 5){
				
			return next (new ErrorResponse('Error', 400, ['user already completed application process']));

		}


	}

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
	const saved = await saveParsed(data)

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

// @desc    Preselect Talent
// @route   PUT /api/v1/talents/preselect/:id
// @access  Private/Superadmin/Admin
export const selectTalent = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

	const { talents, description, businessId, callbackUrl } = req.body;

	const user = await User.findById(req.params.id);

	if(!user){
		return next(new ErrorResponse('Error!', 404, ['user does not exist']));
	}

	if(!callbackUrl){
		return next(new ErrorResponse('Error!', 400, ['callback url is required']));
	}

	if(!description){
		return next(new ErrorResponse('Error!', 400, ['description is required']));
	}

	if(!businessId){
		return next(new ErrorResponse('Error!', 400, ['business id is required']));
	}

	const business = await Business.findById(businessId);

	if(!business){
		return next(new ErrorResponse('Error!', 404, ['business does not exist']));
	}

	if(!talents){
		return next(new ErrorResponse('Error!', 400, ['selected \'talents\' is required']));
	}

	if(typeof(talents) !== 'object'){
		return next(new ErrorResponse('Error!', 400, ['talents data is required to be an array']));
	}

	if(!talents.length || talents.length <= 0){
		return next(new ErrorResponse('Error!', 400, ['talents data is required']));
	}

	const preselect = await Preselect.create({
		description: description,
		business: business._id,
		createdBy: user._id
	})

	// save talents details
	for(let j = 0; j < talents.length; j++){

		const talent = await Talent.findById(talents[j]);

		if(talent && talent.currentlyMatched === undefined ){

			preselect.talents.push(talent._id);
			await preselect.save();

			talent.matchedBusinesses.push(business._id);
			talent.currentlyMatched = business._id;
			await talent.save();

			business.preselects.push(talent._id);
			business.talents.push(talent._id);
			await business.save();
		}

	}

	const token = preselect.getPreselectToken();
	await preselect.save({ validateBeforeSave: false });

	// send email to business 
	if(token){

		let emailData = {
            template: 'welcome',
            email: business.email,
            preheaderText: `Successful Talent${business.preselects.length > 1 ? 's' : ''} Match`,
            emailTitle: 'MYRIOI Talent Match',
            emailSalute: `Hello, ${business.name}`,
            bodyOne: `${business.preselects.length} Talents on the MYRIOI Talent Management Platform has been matched with your requirements. Please use the button below to view talent profiles`,
            buttonUrl: `${callbackUrl}/${token}`,
            buttonText: 'View Talents',
            fromName: 'MYRIOI'
        }

        await sendGrid(emailData);


	}
	
	res.status(200).json({
		error: false,
		errors: [],
		data: { selected: preselect, url:`${callbackUrl}/${token}` },
		message: 'successful',
		status: 200
	})

})

// @desc    Preselect Talent
// @route   PUT /api/v1/talents/preview
// @access  Private/Superadmin/Admin
export const viewSelectedTalents = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

	const { token } = req.body;

	if(!token){
		return new ErrorResponse('Error', 400, ['token is required'])
	}

	const hashed = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

	const preselect = await Preselect.findOne({preselectToken: hashed, preselectTokenExpire: {$gt: new Date() }});

	if(!preselect){
		return next(new ErrorResponse('invalid token', 400, ['token expired']));
	}

	const business = await Business.findById(req.params.id);

	let pType: string;
	if(business && business.passwordType === 'generated'){
		business.passwordType = 'self-changed';
		await business.save();
		pType = 'generated';
	}else{
		pType = 'self-changed';
	}

	const pSelect = await Preselect.findById(preselect._id).populate([ { path: 'talents'}, { path: 'business' } ]);

	const returnData = {
		_id: pSelect?._id,
		description: pSelect?.description,
		talents: pSelect?.talents,
		business: pSelect?.business,
		passwordType: pType
	}
	
	res.status(200).json({
		error: false,
		errors: [],
		data: returnData,
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