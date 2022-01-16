import fs from 'fs';
import colors from 'colors';

import Framework from '../../models/Framework.model';

// read in framewok.json files
const frameworks = JSON.parse(
    fs.readFileSync(`${__dirname.split('config')[0]}_data/framewoks.json`, 'utf-8')
)

export const seedFrameworks = async () => {
    try {
        // fetch all frameworks data in the table
        const f = await Framework.find({});

        if(f && f.length > 0) return;

        const seed = await Framework.create(frameworks)

        if(seed) {
            console.log('frameworks seeded successfully'.green.inverse);
        }
    } catch (err) {
        console.log(`Error: ${err}`.red.inverse)
    }
}