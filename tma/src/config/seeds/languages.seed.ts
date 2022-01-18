import fs from 'fs';
import colors from 'colors';

import Language from '../../models/Language.model';

//  read in languages.json files
const languages = JSON.parse(
    fs.readFileSync(`${__dirname.split('config')[0]}_data/languages.json`, 'utf-8')
)

export const seedLanguages = async () => {
    try {
        // fetch all Industries data in the table
        const l = await Language.find({})

        if (l && l.length > 0) return;

        const seed = await Language.create(languages);

        if (seed) {
            console.log('Languages seeded successfully')
        }
    } catch (err) {
        console.log(`Error: ${err}`.red.inverse)
    }
}