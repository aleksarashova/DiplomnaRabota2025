import {Schema, Model, model} from "mongoose";

export interface PasswordResetKeyInterface {
    email: string;
    key: string;
    expire: Date;
}

type PasswordResetKeyModel = Model<PasswordResetKeyInterface>;

const PasswordResetKeySchema: Schema = new Schema<PasswordResetKeyInterface, PasswordResetKeyModel>({
    email: { type: String },
    key: { type: String },
    expire: { type: Date, required: true, expires: 0 },
}, {collection: 'reset_password_keys'});

const PasswordResetKey: PasswordResetKeyModel = model<PasswordResetKeyInterface, PasswordResetKeyModel>('Password reset key', PasswordResetKeySchema);

export default PasswordResetKey;