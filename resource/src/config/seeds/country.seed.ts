import fs from 'fs';
import colors from 'colors';

import Country from '../../models/Country.model';

// read in the seed file
const data = JSON.parse(
	fs.readFileSync(`${__dirname.split('config')[0]}_data/countries.json`, 'utf-8')
);

export const seedCountry = async () => {

    try {

        const rs = await Country.find();
        if (rs && rs.length > 0) return;

        const seed = await Country.create(data);

        if(seed){
            console.log(colors.green.inverse('Countries seeded successfully.'));
        }

    } catch (err) {
        console.log(colors.red.inverse(`${err}`));
    }

}