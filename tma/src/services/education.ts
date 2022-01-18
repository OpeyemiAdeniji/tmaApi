import Education from '../models/Education.model'

export const validateEducation = async (educations: Array<any> ): Promise<any> => {

    let result = {
        message: '',
        flag: false
    }

    if(educations.length <= 0){

        result.message = 'education data is required to contain valid object data'
        result.flag = false;

    }else{

        for(let i = 0; i < educations.length; i++){

            if(!educations[i].institutionName){
                result.message = 'institution name is required'
                result.flag = false;
                break;
            }
            else if(!educations[i].degree){
                result.message = 'degree is required'
                result.flag = false;
                break;
            }
            else if(!educations[i].startDate){
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

export const addEducations = async (data: Array<any>, user: any, talent: any): Promise<any> => {

    for(let i = 0; i < data.length; i++){

        const edu = await Education.findOne({ institutionName: data[i].institutionName })

        if(!edu){

            await Education.create({

                institutionName: data[i].institutionName,
                degree: data[i].degree,
                startDate: data[i].startDate,
                endDate: data[i].endDate ? data[i].endDate: '',
                isCurrent: data[i].isCurrent ? data[i].isCurrent: false,
                user: user._id,
                talent: talent._id,

            })

        }

    }

}