import { Model, Schema } from 'mongoose';
export declare const connectDB: (authType: string) => void;
export declare const getRoleModel: (authType: string) => Model<Schema>;
