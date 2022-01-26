import Talent from '../models/Talent.model';
import Skill from '../models/Skill.model';
import Category from '../models/Category.model';
import Language from '../models/Language.model';
import Framework from '../models/Framework.model';
import Cloud from '../models/Cloud.model';
import Tool from '../models/Tool.model';
import { sendGrid } from '../utils/email.util';

import { generate } from "../utils/random.util";

export const saveParsed = async (data: any, user: any ) => {

    let result = [];
    let flag, message, pwd

    const validate = await validateTalent(data);

    if(validate.flag === false){

        return {
            flag: false,
            message: validate.message,
            result: []
        }
    }else{

        for(let i = 0; i < data.length; i++){

            const existing = await Talent.findOne({email: data[i].email});

            if(existing){

                flag = false;
                message = 'talent already exists';
                result = [];
                break;

            }else{

                const gen = await generate(8, true)
                pwd = '#Ts' + gen + '1/'

                const talent = await Talent.create({
                    applyStep: 1, 
                    firstName: data[i].firstName,
                    lastName: data[i].lastName,
                    middleName: data[i].middleName,
                    email: data[i].email,
                    user: user._id
                })

                // save the primary skill
                const pSkill = await Skill.findOne({ name: data[i].primarySkill });

                if(pSkill){
                    talent.primarySkill = pSkill._id;
                    await talent.save()

                    pSkill.talents.push(talent._id);
                    await pSkill.save();

                }else{
                    const pSkill = await Category.findOne({ name: data[i].primarySkill });
                    
                    if(pSkill){
                        talent.primarySkill = pSkill._id;
                        await talent.save()
                    }
                }

                // save the primary language
                const pLang = await Language.findOne({ name: data[i].primaryLanguage });

                if(pLang){
                    talent.pLanguage.type = pLang._id;
                    talent.pLanguage.strength = 1;
                    await talent.save()
                }
                
                // save the secondary language(s)
                if(data[i].secondaryLanguage){

                    const languages: Array<string> = data[i].secondaryLanguage.split(',');

                    if(languages.length > 0){

                        for(let i = 0; i < languages.length; i++){

                            let lang = await Language.findOne({ code: languages[i] });

                            if(!lang){

                                 lang = await Language.findOne({ name: languages[i] });

                                if (lang){
            
                                    talent.languages.push({ type: lang._id, strength: 1 });
                                    await talent.save();
                
                                }

                            }
            
                            if (lang){
            
                                talent.languages.push({ type: lang._id, strength: 1 });
                                await talent.save();
            
                            }
            
                        }

                    }

                }

                // save the primary framework
                const pFrame = await Framework.findOne({ name: data[i].primaryFramework })

                if(pFrame){
                    talent.pFramework.type = pFrame._id;
                    talent.pFramework.strength = 1;
                    await talent.save();
                }

                // save the secondary framework
                if(data[i].secondaryFramework){

                    const frameworks: Array<string> = data[i].secondaryFramework.split(',');

                    if(frameworks.length > 0){

                        for(let i = 0; i < frameworks.length; i++){

                            const framework = await Framework.findOne({ name: frameworks[i] })
                            
                            if(framework){
                                talent.frameworks.push({ type: framework._id, strength: 1 });
                                await talent.save();
                            }
                        }
                    }
                }

                // save the primary cloud
                const primCloud = await Cloud.findOne({ name: data[i].primaryCloud });

                if(primCloud){

                    talent.pCloud.type = primCloud._id;
                    talent.pCloud.strength = 1;
                    await talent.save();
                }

                // save the secondary cloud
                if(data[i].secondaryCloud){

                    const clouds: Array<string> = data[i].secondaryCloud.split(',');

                    if(clouds.length > 0){

                        for(let i = 0; i < clouds.length; i++){

                            let cloud = await Cloud.findOne({ code: clouds[i] });

                            if(!cloud){

                                 cloud = await Cloud.findOne({ name: clouds[i] });

                                if(cloud){
                                    talent.clouds.push({ type: cloud._id, strenth: 1 });
                                    await talent.save();
                                }
                            }

                            if(cloud){
                                talent.clouds.push({ type: cloud._id, strenth: 1 });
                                await talent.save();
                            }

                            
                        }
                    }
                }

                result.push(talent)

                user.talent = talent._id;
                await user.save();

                let emailData = {
                    template: 'email-verify',
                    email: user.email,
                    preheaderText: 'MYRIOI',
                    emailTitle: 'Welcome to MYRIOI',
                    emailSalute: 'Hello ' + user.firstName + ',',
                    bodyOne: `MYRIOI has added you as a talent on their talent management platform. Thank you for joining our platform. 
                    Please login to your dashboard with the details below. You will be forced to change your password immediately you login`,
                    bodyTwo: `Email: ${user.email} \n Password: ${pwd}`,
                    fromName: 'MYRIOI'
                }
            
                await sendGrid(emailData);

                flag = true;
                message = `successful`;

                

            }
        }

        return {
            flag: flag,
            message: message,
            result: result
        }
    }
}

export const validateTalent = (data: any): object | any => {

    let flag: boolean = false;
    let message: string = '';

    for(let i = 0; i < data.length; i++){

        const firstName = data[i].firstName;
        const lastName = data[i].lastName;
        const middleName = data[i].middleName;
        const email = data[i].email;
        const primarySkill = data[i].primarySkill;
        const primaryLanguage = data[i].pLanguage;
        const primaryFramework = data[i].pFramework;
        const primaryCloud = data[i].pCloud;
        const secondaryLanguage = data[i].languages
        const secondaryFramework= data[i].frameworks
        const secondaryCloud = data[i].clouds

        if(!firstName && !lastName && !middleName && !email && !primarySkill && !primaryLanguage && !primaryFramework && !primaryCloud && !secondaryLanguage && !secondaryFramework && !secondaryCloud){

            flag = false;
            message = 'talent data does not have required fields';
            break;

        }else if(firstName === ''){
            flag = false;
            message = 'talent data does not have a first name field';
            break;

        }else if(lastName === ''){
            flag = false;
            message = 'talent data does not have a last name field';
            break;

        }else if(middleName === ''){
            flag= false;
            message = 'talent does not have a middle name field';
            break;

        }else if(middleName === ''){
            flag= false;
            message = 'talent does not have a middle name field';
            break

        }else if(primarySkill === ''){
            flag = false;
            message = 'talent does not have a primarySkill';
            break;

        }else if(primaryLanguage === ''){
            flag = false;
            message = 'talent does not have a primary language';
            break;

        }else if(primaryFramework === ''){
            flag = false;
            message = 'talent does not have a primary framework';
            break;

        }else if(primaryCloud === ''){
            flag = false;
            message = 'talent does not have a primary cloud';
            break;

        }else if(secondaryLanguage === ''){
            flag = false;
            message = 'talent does not have a languages';
            break;

        }else if(secondaryFramework === ''){
            flag = false;
            message = 'talent does not have a frameworks';
            break;

        }else if(secondaryCloud === ''){
            flag = false;
            message = 'talent does not have a clouds';
            break;

        }else{
            flag = true;
            message = '';
            continue;
        }
    }

    return { flag: flag, message: message }
}
