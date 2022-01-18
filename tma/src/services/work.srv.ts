import Work from '../models/Work.model'

export const validateWorks = async (works: Array<any> ): Promise<any> => {

    let result = {
        message: '',
        flag: false
    }

    if(works.length <= 0){

        result.message = 'works is required to contain valid object data'
        result.flag = false;

    }else{

        for(let i = 0; i < works.length; i++){

            if(!works[i].companyName){
                result.message = 'company name is required'
                result.flag = false;
                break;
            }
            else if(!works[i].companyUrl){
                result.message = 'company url is required'
                result.flag = false;
                break;
            }
            else if(!works[i].role){
                result.message = 'role is required'
                result.flag = false;
                break;
            }
            else if(!works[i].description){
                result.message = 'description is required'
                result.flag = false;
                break;
            }
            else if(!works[i].startDate){
                result.message = 'start date is required'
                result.flag = false;
                break;
            }
            else{

                result.message = ''
                result.flag = true;
                continue;

            }

        }

    }


    return result;

}

export const addWorks = async (works: Array<any>, user: any, talent: any): Promise<any> => {

    for(let i = 0; i < works.length; i++){

        const work = await Work.findOne({ companyName: works[i].companyName })

        if(!work){

            await Work.create({

                companyName: works[i].companyName,
                companyUrl: works[i].companyUrl,
                description: works[i].description,
                role: works[i].role,
                startDate: works[i].startDate,
                endDate: works[i].endDate ? works[i].endDate : '',
                isCurrent: works[i].isCurrent ? works[i].isCurrent : false,
                user: user._id,
                talent: talent._id,

            })

        }

    }

}