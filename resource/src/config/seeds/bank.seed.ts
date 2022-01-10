import fs from 'fs';
import colors from 'colors';

import Bank from '../../models/Bank.model';

// read in the seed file
const data = JSON.parse(
	fs.readFileSync(`${__dirname.split('config')[0]}_data/banks.json`, 'utf-8')
);

export const seedBanks = async () => {

    try {

        const rs = await Bank.find();
        if (rs && rs.length > 0) return;

        const seed = await Bank.create(data);

        if(seed){
            console.log(colors.green.inverse('Banks seeded successfully.'));
        }

    } catch (err) {
        console.log(colors.red.inverse(`${err}`));
    }

}