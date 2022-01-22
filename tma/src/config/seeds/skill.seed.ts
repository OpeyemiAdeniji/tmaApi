import fs from 'fs';
import colors from 'colors';

import Skill from '../../models/Skill.model';
import Tool from '../../models/Tool.model';
import Category from '../../models/Category.model';

// read in skills.json files
const skills = JSON.parse(
    fs.readFileSync(`${__dirname.split('config')[0]}_data/skills.json`, 'utf-8')
)

const tools = JSON.parse(
    fs.readFileSync(`${__dirname.split('config')[0]}_data/tools.json`, 'utf-8')
)

export const seedSkills = async () => {
    try {
        
        for(let j = 0; j < skills.length; j++){

            const sk = await Skill.findOne({ name: skills[j].name });

            if(!sk){

                const category = await Category.findOne({ code: skills[j].category });

                const skill = await Skill.create({

                    name: skills[j].name,
                    shortCode: skills[j].shortCode,
                    category: category?._id,
                    description: skills[j].description

                })

                category?.skills.push(skill._id);
                await category?.save();

            }

        }

    } catch (err) {
        console.log(colors.red.inverse(`${err}`));
    }

}

export const seedTools = async () => {
    try {
        
        for(let j = 0; j < tools.length; j++){

            const sk = await Tool.findOne({ name: tools[j].name });

            if(!sk){

                const category = await Category.findOne({ code: tools[j].category });

                const tool = await Tool.create({

                    name: tools[j].name,
                    brand: tools[j].brand,
                    category: category?._id,
                    description: tools[j].description

                })

                category?.tools.push(tool._id);
                await category?.save();

            }

        }

    } catch (err) {
        console.log(colors.red.inverse(`${err}`));
    }

}