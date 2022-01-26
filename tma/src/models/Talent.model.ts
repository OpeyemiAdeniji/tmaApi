    import mongoose, { ObjectId } from 'mongoose'
import slugify from 'slugify'

// interface that describes the properties the model has
interface ITalentModel extends mongoose.Model<ITalentDoc> {

    // functions
    findByName(name: string): ITalentDoc;
    getTalentName(id: any): ITalentDoc;
    getAllTalents(): any;

}

// interface that describes the properties that the Doc has
interface ITalentDoc extends mongoose.Document{

    bio: string;
    firstName: string;
    lastName: string;
    middleName: string; 
    gender: string,
    phoneNumber: string,
    location: string,
    address: string,
    level: string,
    band: number,
    currentSalary: object | any,
    employmentStatus: boolean,
    email: string,
    linkedinUrl: string,
    githubUrl: string,
    dribbleUrl: string,
    portfolioUrl: string,
    resumeUrl: string,
    slug: string;
    pLanguage: object | any;
    pFramework: object | any;
    pCloud: object | any;
    jobType: string;
    workType: string;
    workCategory: object | any;
    applyStep: number;
    

    languages: Array<object | any>;
    frameworks: Array<object | any>;
    clouds: Array<object | any>;

    primarySkill: mongoose.Schema.Types.ObjectId | any;
    skills: Array<mongoose.Schema.Types.ObjectId | any>
    tools: Array<mongoose.Schema.Types.ObjectId | any>
    matchedBusinesses: Array<mongoose.Schema.Types.ObjectId | any>;
    currentlyMatched: mongoose.Schema.Types.ObjectId | undefined;
    user: mongoose.Schema.Types.ObjectId | any;
    educations: Array<mongoose.Schema.Types.ObjectId | any>,
    works: Array<mongoose.Schema.Types.ObjectId | any>

    // time stamps
    createdAt: string;
    updatedAt: string;
    _version: number;
    _id: mongoose.Schema.Types.ObjectId;
    id: mongoose.Schema.Types.ObjectId;

    // functions
    findByName(name: string): ITalentDoc;
    getTalentName(id: any): ITalentDoc;
    getAllTalents(): any


}

const TalentSchema = new mongoose.Schema (

    {

        bio: {
            type: String,
        },

        firstName: {
            type: String,
            required: [true, 'first name is required']
        },

        lastName: {
            type: String,
            required: [true, 'last name is required']
        },

        middleName: {
            type: String
        },

        gender: {
            type: String,                            
            enum: ['male', 'female']
        },

        phoneNumber: {
            type: String
        },

        location: {
            type: String
        },

        address: {
            type: String
        },

        level: {
            type: String,
            enum: ['junior', 'intermidiate', 'senior']
        },
        
        band: {
            type: Number
        },

        currentSalary: {
            value: {
                type: Number,
                default: 0
            }, 
            currency: {
                type: String,
                max: [3, 'currency cannot be more than 3 characters'],
                min: [2, 'currency cannot be less than 2 characters']
            }
        },

        employmentStatus: {
            type: Boolean
        },

        email: {
			type: String
		},

        linkedinUrl: {
            type: String
        },

        githubUrl: {
            type: String,
        },

        dribbleUrl: {
            type: String,
        },

        portfolioUrl: {
            type: String
        },

        resumeUrl: {
            type: String
        },

        applyStep: {
            type: Number,
            default: 1
        },

        pLanguage: {
            type: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Language'
            },
            strength: {
                type: Number,
                min: [1, 'language strength cannot be less than 1'],
                max: [5, 'language strength cannot be more than 5']
            }
        },

        pFramework: {
            type: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Framework'
            },
            strength: {
                type: Number,
                min: [1, 'framework strength cannot be less than 1'],
                max: [5, 'framework strength cannot be more than 5']
            }
        },

        pCloud: {
            type: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Cloud'
            },
            strength: {
                type: Number,
                min: [1, 'cloud strength cannot be less than 1'],
                max: [5, 'cloud strength cannot be more than 5']
            }
        },

        languages: [
            {
                type: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Language'
                },
                strength: {
                    type: Number,
                    min: [1, 'language strength cannot be less than 1'],
                    max: [5, 'language strength cannot be more than 5']
                }
            }
        ],

        frameworks: [
            {
                type: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Framework'
                },
                strength: {
                    type: Number,
                    min: [1, 'framework strength cannot be less than 1'],
                    max: [5, 'framework strength cannot be more than 5']
                }
            }
        ],

        clouds: [
            {
                type: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Cloud'
                },
                strength: {
                    type: Number,
                    min: [1, 'cloud strength cannot be less than 1'],
                    max: [5, 'cloud strength cannot be more than 5']
                }
            }
        ],

        jobType: {
            type: String,
            enum: ['remote', 'on-site', 'hybrid']
        },

        workType: {
            type: String,
            enum: ['contract', 'permanent']
        },

        workCategory: {

            type: {
                type: String,
                enum: ['part-time', 'full-time']
            },

            availability: {
                type: String
            }

        },

        slug: String,

        primarySkill: {
            type: mongoose.Schema.Types.ObjectId,
        },

        skills: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Skill'
            }
        ],

        tools: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Tool'
            }
        ],

        matchedBusinesses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Business'
            }
        ],

        currentlyMatched: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Business'
            }
        ],

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },

        educations: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Education'
            }
        ],

        works: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Work'
            }
        ]
        

    },

    {
        timestamps: true,
        versionKey: '_version',
        toJSON: {
            transform(doc, ret){
                ret.id = ret._id
            }
        }
    }

)

TalentSchema.set('toJSON', { getters: true, virtuals: true });

TalentSchema.pre<ITalentDoc>('save', async function(next){
    this.slug = slugify(this.firstName, { lower: true });
    next();
});

TalentSchema.statics.findByFirstName = (name) => {
    return Talent.findOne({firstName: name});
}

TalentSchema.statics.getTalentName = async (id) => {
    const talent = await Talent.findById(id);
    return talent?.firstName + ' ' + talent?.lastName;
}

TalentSchema.statics.getAllTalents = () => {
    return Talent.find({});
}

// define the model constant
const Talent = mongoose.model<ITalentDoc, ITalentModel>('Talent', TalentSchema);

export default Talent;