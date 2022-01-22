import { seedClouds } from './clouds.seed';
import { seedFrameworks } from './frameworks.seed';
import { seedIndustries } from './industries.seed';
import { seedLanguages } from './languages.seed';
import { seedCategories } from './category.seed.';
import { seedSkills, seedTools } from './skill.seed';

export const seedData = async (): Promise<void> => {

    await seedIndustries();
    await seedClouds();
    await seedFrameworks();
    await seedLanguages();
    await seedCategories();
    await seedSkills();
    await seedTools();

}