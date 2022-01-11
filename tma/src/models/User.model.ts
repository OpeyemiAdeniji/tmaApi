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
	middleName: string;
    username: string;
    email: string;
    phoneNumber: string;

    tracks: Array<string>;
    courses: Array<mongoose.Schema.Types.ObjectId | any>;
    transactions: Array<mongoose.Schema.Types.ObjectId | any>;

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
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        recipientCode: {
            type: String,
        },

        firstName: {
            type: String,
        },

        lastName: {
            type: String,
        },

        middleName: {
            type: String,
        },

        username: {
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

        tracks: [
            {
                type: String
            }
        ],

        courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course'
            }
        ],

        transactions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Transactions'
            }
        ],

        cards: [
			{
                type: mongoose.Schema.Types.ObjectId,
           	    ref: 'User'
            }
		],

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

UserSchema.pre('save', async function(next){
    next();
});

UserSchema.statics.findByUserId = (id) => {
    return User.findOne({userId: id});
}

// define the model constant
const User = mongoose.model<IUserDoc, IUserModel>('User', UserSchema);

export default User;
