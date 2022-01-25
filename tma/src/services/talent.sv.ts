import { isTemplateExpression } from 'typescript';
import Talent from '../models/Talent.model';
import Skill from '../models/Skill.model';
import Category from '../models/Category.model';
import Language from '../models/Language.model';
import Framework from '../models/Framework.model';
import Cloud from '../models/Cloud.model';
import User from '../models/User.model';

export const saveParsed = async (data: any, user: any ) => {

    let result = [];
    let flag, message

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

                const talent = await Talent.create({
                    applyStep: 1, 
                    firstName: data[i].firstName,
                    lastName: data[i].lastName,
                    middleName: data[i].middleName,
                    bio: data[i].bio,
                    user: user._id
                })

                // save the primary skill
                const pSkill = await Skill.findOne({ name: data[i].primarySkill});

                if(pSkill){
                    talent.primarySkill = pSkill._id;
                    await talent.save()
                }else{
                    const pSkill = await Category.findOne({ name: data[i].primarySkill});
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

                            const lang = await Language.findOne({ code: languages[i] });

                            if(!lang){

                                const lang = await Language.findOne({ name: languages[i] });

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



            }
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
        const bio = data[i].bio;
        const strength = data[i].strength;
        const primarySkill = data[i].primarySkill;
        const primaryLanguage = data[i].primaryLanguage;
        const primaryFramework = data[i].primaryFramework;
        const primaryCloud = data[i].primaryCloud;
        const tools = data[i].tools;
        const languages = data[i].languages;
        const frameworks = data[i].frameworks;
        const clouds = data[i].clouds;

        if(!firstName && !lastName && !middleName && !bio && !primarySkill && !primaryLanguage && !primaryFramework && !primaryCloud && !tools && !languages && !frameworks && !clouds){

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

        }else if(bio === ''){
            flag = false;
            message = 'talent does not have a bio field';
            break;

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

        }else if(tools === ''){
            flag = false;
            message = 'talent does not have a tools';
            break;

        }else if(languages === ''){
            flag = false;
            message = 'talent does not have a languages';
            break;

        }else if(frameworks === ''){
            flag = false;
            message = 'talent does not have a frameworks';
            break;

        }else if(clouds === ''){
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
