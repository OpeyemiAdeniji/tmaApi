import Role from '../../models/Role.model'
import Permission from '../../models/Permission.model'
import Resource from '../../models/Resource.model'
import User from '../../models/User.model'
import colors from 'colors';

import { seedRoles } from './role.seed'
import { seedPermissions } from './permission.seed'
import { seedResources } from './resource.seed'
import { seedUsers } from './user.seed'


// role functions
const attachSuperRole = async (): Promise<void> => {

    const superadmin = await User.findOne({ email: 'hello@concreap.com' });
    const role = await Role.findOne({ name: 'superadmin' });


    if(superadmin && role){

        const asRole = await superadmin.hasRole('superadmin', superadmin.roles);

        if(!asRole){

            superadmin.roles.push(role._id);
            await superadmin.save();

            console.log(colors.magenta.inverse('Superadmin role attached successfully'));

        }

    }

}

export const seedData = async (): Promise<void> => {

    await seedRoles();
    await seedPermissions();
    await seedUsers();

    // attach superadmin role
    await attachSuperRole();

}
