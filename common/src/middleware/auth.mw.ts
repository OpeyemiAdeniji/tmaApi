import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request } from 'express'
import { getRolesByName } from './role.mw'
import { ObjectId } from 'mongoose'

export const protect = (req: Request, secret: string): string | JwtPayload => {

    let result: string | JwtPayload = '';
    let token: string = '';

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){

        token = req.headers.authorization.split(' ')[1];  // get token from bearer

    }else if(req.cookies.token){

        token = req.cookies.token;

    }

    if(!token || token === ''){
        result = ''
    }

    if(token){

        const jwtData = jwt.verify(token, secret);
        result = jwtData;

    }

    return result;

}

export const authorize = async (roles: Array<string>, userRoles: Array<string>, authType: string, authDB: string): Promise<boolean> => {

    let allRoles: any = [];
    let resultFlag: boolean = false;

    await getRolesByName(roles, authType, authDB).then((resp) => {
        // console.log(resp);
        allRoles = [...resp];
    });

    // console.log(' ');
    // console.log(' ');
    // console.log(' user roles ');
    // console.log(userRoles);

    // get authorized IDs
    const ids = allRoles.map((e: any) => { return e._id });

    // check if user roles matches the authorized roles
    const flag = await checkRole(ids, userRoles);

    if(flag){
        resultFlag = true
    }else{
        resultFlag = false;
    }

    return resultFlag;


}

const checkRole = (roleIds: Array<string>, roles: Array<string>): boolean => {

    let flag: boolean = false;

    for(let i = 0; i < roleIds.length; i++){

        for(let j = 0; j < roles.length; j++){

            if(roleIds[i].toString() === roles[j].toString()){
                flag = true;
            }

        }

    }

    return flag;

}