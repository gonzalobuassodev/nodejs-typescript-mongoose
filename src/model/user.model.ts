import mongoose, { Schema, Document, ObjectId } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  id?: string;
  username: string;
  password: string;
  name?: string;
}

const UserSchema: Schema = new Schema({
  id: {
    type: Object,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
});

UserSchema.pre('save', function (next) {
  if (this.isModified('password') || this.isNew) {
    const document = this;

    bcrypt.hash(document.password, 10, (err, hash) => {
      if (err) return next(err);
      document.password = hash;
      next();
    });
  }
});

// UserSchema.methods.usernameExists = async function (
//   username: string
// ): Promise<boolean> {
//   let result = await mongoose.model('User').find({ username: username });
//   return result.length > 0;
// };

UserSchema.methods.isCorrectPassword = async function (
  password: string,
  hash: string
): Promise<boolean> {
  console.log(password, hash);
  const same = await bcrypt.compare(password, hash);
  return same;
};

export const UserModel = mongoose.model<IUser>('User', UserSchema);
