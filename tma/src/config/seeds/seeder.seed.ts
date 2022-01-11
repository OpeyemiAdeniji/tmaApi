import colors from 'colors';
import { seedCategories } from './categories.seed'


export const seedData = async (): Promise<void> => {

    await seedCategories();

}