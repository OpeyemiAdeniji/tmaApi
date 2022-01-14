import mongoose, { ObjectId } from 'mongoose'
import slugify from 'slugify'

// interface that describes the properties the model
interface IPreselectModel extends mongoose.Model<IPreselectDoc> {

    // functions
    getAllPreselected(): any
}

// interface that describes the properties the Doc has
interface IPreselectDoc extends mongoose.Document{

    description: string,
    slug: string

    talents: Array<mongoose.Schema.Types.ObjectId | any>;
    businesses: Array<mongoose.Schema.Types.ObjectId | any>;

    // timestamps
    createdAt: string;
    updatedAt: string;
    _version: string;
    _id: mongoose.Schema.Types.ObjectId;
    id: mongoose.Schema.Types.ObjectId;

    // functions
    getAllPreselected(): any
}

const PreselectSchema = new mongoose.Schema(

    {
        description: {
            type: String,
            required: [true, 'description is required']
        },

        talents: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Talent'
            }
        ],
     
        businesses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Business'
            }
        ],

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Business'
        },

        slug: String,
        
        preselectedToken: String,
        preselectedTokenExpire: Date
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

PreselectSchema.set('toJSON', { getters: true, virtuals: true });

PreselectSchema.pre<IPreselectDoc>('save', async function(next){
    this.slug = slugify('talent' , { lower: true });
    next()
})

PreselectSchema.statics.getAllPreselected = () => {
    return Preselect.find({});
}

// define the model constant
const Preselect = mongoose.model<IPreselectDoc, IPreselectModel>('Preselect', PreselectSchema);

export default Preselect;
