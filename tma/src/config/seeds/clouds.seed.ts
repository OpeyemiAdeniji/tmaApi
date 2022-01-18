import fs from 'fs';
import colors from 'colors';

import Cloud from '../../models/Cloud.model';

// read in clouds.json files
const clouds = JSON.parse(
    fs.readFileSync(`${__dirname.split('config')[0]}_data/clouds.json`, 'utf-8')
)

export const seedClouds = async () => {
    try {
        // fetch all clouds data in the table
        const c = await Cloud.find({});

        if(c && c.length > 0) return;

        const seed = await Cloud.create(clouds)

        if(seed){
            console.log(colors.green.inverse('clouds seeded successfully.'));
        }

    } catch (err) {
        console.log(colors.red.inverse(`${err}`));
    }

}