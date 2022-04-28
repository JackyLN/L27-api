var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

const SALT_WORK_FACTOR = 10;

var UserSchema = new Schema(
  {
    full_name: { type: String },
    email: { type: String, required: true, lowercase: true },
    password: { type: String }
  },
  {
    timestamps: {
      createdAt: 'created',
      updatedAt: 'updated'
    },
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        
        delete ret._id;
        delete ret.password;
      }
    }
  }
);

UserSchema.pre('save', function (next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);