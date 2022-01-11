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

export const getRolesByName = async (roles: Array<string>, authType: string): Promise<any> => {
    const Role = await getRoleModel(authType);
    const result = roles.map( async (r) => await findByName(Role, r));
    const authorized = Promise.all(result);
    return authorized;
}

// export const getRoleNames = async (roleIDs: Array<string>): Promise<any> => {
//     const Role = await getRoleModel();
//     const result = roleIDs.map(async (id) => await getRoleName(Role, id));
//     const rIds = Promise.all(result);
//     return rIds;
// }