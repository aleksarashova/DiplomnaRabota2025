import {Schema, Model, model} from "mongoose";

export interface VerificationCodeInterface {
    email: string;
    code: number;
    expire: Date;
}

type VerificationCodeModel = Model<VerificationCodeInterface>;

const VerificationCodeSchema: Schema = new Schema<VerificationCodeInterface, VerificationCodeModel>({
    email: { type: String },
    code: { type: Number },
    expire: { type: Date, required: true, expires: 0 },
}, {collection: 'verification_codes'});

const VerificationCode: VerificationCodeModel = model<VerificationCodeInterface, VerificationCodeModel>('Verification code', VerificationCodeSchema);

export default VerificationCode;