import colors from 'colors';

import { seedBanks } from './bank.seed';
import { seedCountry } from './country.seed';
import { seedLanguages } from './language.seeder';

export const seedData = async () => {

    await seedCountry();
    await seedBanks();
    await seedLanguages();

}

export default seedData;