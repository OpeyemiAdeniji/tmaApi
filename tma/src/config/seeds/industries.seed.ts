import fs from 'fs';
import colors from 'colors';

import Industry from '../../models/Industry.model';

// read in industries.json files
const industries = JSON.parse(
    fs.readFileSync(`${__dirname.split('config')[0]}_data/industries.json`, 'utf-8')
)

export const seedIndustries = async () => {
    try {
        // fetch all Industries data in the table
        const i = await Industry.find({});

        if(i && i.length > 0) return;

        const seed = await Industry.create(industries)

        if(seed) {
            console.log(colors.green.inverse('industries seeded successfully'));
        }
    } catch (err) {
        console.log(colors.red.inverse(`Error: ${err}`))
    }
}