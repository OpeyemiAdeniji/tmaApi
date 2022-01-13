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

// import models
import Education from '../models/Education.model';
import User from '../models/User.model';

//  @desc   Get all education
//  @route  GET /api/tma/v1/education
//  @access Private superadmin/admin
export const getEducations = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(res.advancedResults);
});

//  @desc   Get a single education
//  @route  GET /api/tma/v1/education/:id
//  @access Private superadmin/admin
export const getEducation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
    const education = await Education.findById(req.params.id);

    if (!education) {
        return next(new ErrorResponse('Error', 404, ['Education not found']))
    }

    res.status(200).json({
        error: false,
        errors: [],
        data: education,
        message: 'successful',
        status: 200
    })
});

//  @desc   Create education
//  @route  POST /api/tma/v1/education?user_id
//  @access Private
export const createEducation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
    const { institutionName, degree, startDate, endDate } = req.body;
    
    const { user_id } = req.query;

    const user = await User.findOne({ userId: user_id })

    if (!user) {
        return next(new ErrorResponse('Error', 404, ['user does not exist']))
    }

    if (!institutionName) {
        return next(new ErrorResponse('Error', 404, ['user_id is required as a url params']))
    }

    if (!user_id) {
        return next(new ErrorResponse('Error', 404, ['institution name is required']))
    }

    if (!degree) {
        return next(new ErrorResponse('Error', 404, ['degree is required']))
    }

    if (!strIncludesEs6(startDate, '/')) {
        return next(new ErrorResponse('invalid format', 400, ['start date is required in the formaT YYYY/MM/DD']))
    }

    if (startDate.split('/')[0].length !== 4 && startDate.split('/')[1].length !== 2 && startDate.split('/')[2].length !== 2) {
        return next(new ErrorResponse('Invalid format', 400, ['start date is required in the format YYYY/MM/DD']))
    }

    if (!strIncludesEs6(endDate, '/')) {
        return next(new ErrorResponse('invalid format', 400, ['end date is required in the formaT YYYY/MM/DD']))
    }

    if (endDate.split('/')[0].length !== 4 && endDate.split('/')[1].length !== 2 && endDate.split('/')[2].length !== 2) {
        return next(new ErrorResponse('invalid format', 400, ['end date is required in the formaT YYYY/MM/DD']))
    }

    const eduInfo = await Education.create({
        institutionName: institutionName,
        degree: degree,
        startDate: startDate,
        endDate: endDate,
        user: user_id
    })

    res.status(200).json({
        error: false,
        errors: [],
        data: eduInfo,
        message: 'successful',
        status: 200
    });
});