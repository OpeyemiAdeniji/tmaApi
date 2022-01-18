import fs from 'fs';
import colors from 'colors';

import Framework from '../../models/Framework.model';

// read in framewok.json files
const frameworks = JSON.parse(
    fs.readFileSync(`${__dirname.split('config')[0]}_data/frameworks.json`, 'utf-8')
)

export const seedFrameworks = async () => {
    try {
        // fetch all frameworks data in the table
        const f = await Framework.find({});

        if(f && f.length > 0) return;

        const seed = await Framework.create(frameworks)

        if(seed) {
            console.log(colors.green.inverse('frameworks seeded successfully'));
        }
    } catch (err) {
        console.log(colors.red.inverse(`Error: ${err}`))
    }
}