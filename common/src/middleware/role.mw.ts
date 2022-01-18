import { getRoleModel } from './db.mw'
import mongoose, { Model, Schema } from 'mongoose'

const findByName = async (model: Model<Schema>, name: string): Promise<any> => {
    const role = await model.findOne({ name: name });
    return role;
}

const getRoleName = async (model: Model<Schema>, id: string): Promise<any> => {
    const role = await model.findOne({ _id: id });
    return role;
}

export const getRolesByName = async (roles: Array<string>, authType: string, authDB: string): Promise<any> => {

    const Role = await getRoleModel(authType, authDB);

    let resultArr: Array<any> = [];
    const allRoles = await Role.find({});

    for (let i = 0; i < roles.length; i++){

        for(let j = 0; j < allRoles.length; j++){

            if(roles[i].toString() === allRoles[j].eventNames.toString()){
                resultArr.push(allRoles[j]);
            }

        }
        
    }

    return resultArr;
}

// export const getRoleNames = async (roleIDs: Array<string>): Promise<any> => {
//     const Role = await getRoleModel();
//     const result = roleIDs.map(async (id) => await getRoleName(Role, id));
//     const rIds = Promise.all(result);
//     return rIds;
// }