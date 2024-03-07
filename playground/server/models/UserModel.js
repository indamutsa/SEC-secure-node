// First we have to bring in mongoose
const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

// Here we define the schema for our users
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true, // trim preceding spaces and trailing whitespaces
      index: { unique: true }, // the username should be unique
      minlength: 6,
    },
    email: {
      type: String,
      required: true,
      trim: true, // trim preceding spaces and trailing whitespaces
      lowercase: true, // normalize email addresses to lowercase
      index: { unique: true }, // the email address needs to be unique
    },
    password: {
      type: String,
      required: true,
      minlength: 8, // A password needs to be at least 8 characters long
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: true,
      index: true,
      unique: true,
      default: () => crypto.randomBytes(20).toString('hex'), // generate a random token for the user to verify them
    },
  },
  {
    timestamps: true,
  }
);

// This function adds a method that hash the password
async function generateHash(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Pre-save hook to hash the password before saving the user to the database
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await generateHash(user.password).catch((err) => {
      console.error(err);
      return next(err);
    });
  }
  return next();
});

// Method to compare the password for the user
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// We export the model `User` from the `UserSchema`
module.exports = mongoose.model('User', userSchema);
