import mongoose, { ObjectId } from 'mongoose'
import slugify from 'slugify'

// interface that describes the properties the model has
interface IUserModel extends mongoose.Model<IUserDoc> {

    // functions
    findByUserId(id: any): IUserDoc;

}

// interface that describes the properties that the Doc has
interface IUserDoc extends mongoose.Document{

    userId: mongoose.Schema.Types.ObjectId | any;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    userType: string;
    isActive: Boolean;

    talent: mongoose.Schema.Types.ObjectId | any;
    skill: mongoose.Schema.Types.ObjectId | any;
    educations: Array<mongoose.Schema.Types.ObjectId | any>,
    works: Array<mongoose.Schema.Types.ObjectId | any>

    // time stamps
    createdAt: string;
    updatedAt: string;
    _version: number;
    _id: mongoose.Schema.Types.ObjectId;
    id: mongoose.Schema.Types.ObjectId;

    // functions
    findByUserId(id: any): IUserDoc;


}

const UserSchema = new mongoose.Schema (

    {

        userId: {
            type: mongoose.Schema.Types.ObjectId
        },

        firstName: {
            type: String,
        },

        lastName: {
            type: String,
        },

        userType: {
            type: String,
        },

        phoneNumber: {
            type: String,
        },

        email: {
			type: String
		},

        isActive: {
			type: Boolean
		},

        talent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Talent'
        },

        skill: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill'
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

UserSchema.set('toJSON', { getters: true, virtuals: true });

UserSchema.pre<IUserDoc>('save', async function(next){
    next();
});

UserSchema.statics.findByUserId = (id) => {
    return User.findOne({userId: id});
}

// define the model constant
const User = mongoose.model<IUserDoc, IUserModel>('User', UserSchema);

export default User;
