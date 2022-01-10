import fs from 'fs';
import colors from 'colors';

import Language from '../../models/Language.model';

// read in the seed file
const data = JSON.parse(
	fs.readFileSync(`${__dirname.split('config')[0]}_data/languages.json`, 'utf-8')
);

export const seedLanguages = async () => {

    try {

        const rs = await Language.find();
        if (rs && rs.length > 0) return;

        const seed = await Language.create(data);

        if(seed){
            console.log(colors.green.inverse('Languages seeded successfully.'));
        }

    } catch (err) {
        console.log(colors.red.inverse(`${err}`));
    }

}