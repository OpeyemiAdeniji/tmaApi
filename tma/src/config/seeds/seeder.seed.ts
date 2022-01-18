import { seedCategories } from './categories.seed';
import { seedClouds } from './clouds.seed';
import { seedFrameworks } from './frameworks.seed';
import { seedIndustries } from './industries.seed';
import { seedLanguages } from './languages.seed';

export const seedData = async (): Promise<void> => {

    await seedCategories();
    await seedClouds();
    await seedFrameworks();
    await seedIndustries();
    await seedLanguages();

}