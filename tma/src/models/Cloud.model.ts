import mongoose, { ObjectId } from 'mongoose'
import slugify from 'slugify'

// interface that describes the properties the model has
interface ICloudModel extends mongoose.Model<ICloudDoc> {

    // functions
    
    findByName(name: String): ICloudDoc;

}

// interface that describes the properties that the Doc
interface ICloudDoc extends mongoose.Document{
    name: string;
    description: string;

    // timestamps
    createdAt: string;
    updatedAt: string
    _version: number;
    _id: mongoose.Schema.Types.ObjectId;
    id: mongoose.Schema.Types.ObjectId;

      // functions
      findByName(name: String): ICloudDoc;
}

const CloudSchema = new mongoose.Schema (

    {
        name: {
            type: String,
            required: [true, 'please enter your cloud']
        },
        description: {
            type: String
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

CloudSchema.set('toJSON', { getters: true, virtuals: true });

CloudSchema.pre<ICloudDoc>('save', async function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

CloudSchema.statics.getPayment = function (id) {
    return this.findById(id);
};

const cloud = mongoose.model<ICloudDoc, ICloudModel>('Cloud', CloudSchema);

export default cloud;