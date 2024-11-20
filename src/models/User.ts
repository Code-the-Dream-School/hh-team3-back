import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

const root = process.env.PROFILE_PICTURE_ROOT;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide the name'],
      minLength: 3,
      maxLength: 30,
    },
    lastname: {
      type: String,
      required: [true, 'Please provide the last name'],
      minLength: 3,
      maxLength: 30,
    },
    email: {
      type: String,
      required: [true, 'Please provide the email'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide the valid email'
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide the password'],
      minLength: 6,
    },
    photo: {
      type: String,
      required: false,
      default: './images/default-avatar.jpg',
      get: (profilePicture: string) => `${root}/${profilePicture}`,
      validate: {
        validator: function (value: string) {
          return /^(?!.*\.\.\/).*\.jpg|\.jpeg|\.png|\.gif$/.test(value);
        },
        message: 'Photo must be a valid image file.',
      },

    },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
})

export interface IUser extends Document {
  name: string;
  lastname: string;
  email: string;
  password: string;
  photo?: string;
}

export default User;
