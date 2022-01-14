import mongoose, { ObjectId } from 'mongoose'
import slugify from 'slugify'

// interface that describes the properties the model has
interface ITalentModel extends mongoose.Model<ITalentDoc> {

    // functions
    findByName(name: string): ITalentDoc;
    getTalentName(id: ObjectId): ITalentDoc;
    getAllTalents(): any

}

// interface that describes the properties that the Doc has
interface ITalentDoc extends mongoose.Document{

    firstName: string;
    lastName: string;
    middleName: string;
    gender: string,
    phoneNumber: string,
    address: string,
    level: string,
    band: number,
    type: string,
    currentSalary: string,
    employmentStatus: string,
    email: string,
    linkedinUrl: string,
    githubUrl: string,
    dribbleUrl: string,
    portfolioUrl: string,
    resumeUrl: string,
    slug: string;

    businesses: Array<mongoose.Schema.Types.ObjectId | any>;
    user: mongoose.Schema.Types.ObjectId | any

    // time stamps
    createdAt: string;
    updatedAt: string;
    _version: number;
    _id: mongoose.Schema.Types.ObjectId;
    id: mongoose.Schema.Types.ObjectId;

    // functions
    findByName(name: string): ITalentDoc;
    getTalentName(id: ObjectId): ITalentDoc;
    getAllTalents(): any


}

const TalentSchema = new mongoose.Schema (

    {

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
            enum: ['male', 'female'],
            required: [true, 'gender is required']
        },

        phoneNumber: {
            type: String
        },

        address: {
            type: String
        },

        level: {
            type: String,
            enum: ['junior', 'intermediate', 'expert'],
            required: [true, 'level is required']
        },
        
        band: {
            type: Number
        },

        type: {
            type: String,
            enum: ['frontend', 'backend']
        },

        currentSalary: {
            type: String
        },

        employmentStatus: {
            type: String
        },

        email: {
			type: String,
			required: [true, 'email is required'],
			unique: [true, 'email already exist'],
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				'a valid email is required',
			],
		},

        linkedinUrl: {
            type: String
        },

        githubUrl: {
            type: String
        },

        dribbleUrl: {
            type: String
        },

        portfolioUrl: {
            type: String
        },

        resumeUrl: {
            type: String
        },

        slug: String,

        businesses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Business'
            }
        ],

        user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }

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