const assert = require('assert-plus');
const UserSchema = require('../models/User');

class UserService {
  constructor(mongoConnection) {
    this.models = {
      User: mongoConnection.model('User', UserSchema)
    };
  }

  //TODO
  async createDefaultUser(defaultUser) {

    try {
      const existedUser = await this.findUserByEmail(defaultUser.email);
      if (!existedUser) {
        const newDefaultUser = this.models.User.create({ email: defaultUser.email, full_name: defaultUser.full_name });
        return newDefaultUser.toJSON();
      }
      return existedUser.toJSON();
    } catch (ex) {
      throw (ex);
    }
  }

  //TODO
  async findUserByEmail(email) {
    assert.string(email);

    const user = this.models.User.findOne({ email: email });

    return user.toJSON();

  }

  async findUserByEmailAndPassword(email, password) {
    assert.string(email);
    assert.string(password);
    try {

      const user = findUserByEmail(email);

      const comparePassword = await user.comparePassword(req.body.password);

      if (comparePassword) {
        return user.toJSON();
      } else {
        return new Error('User Not Found');
      }
    } catch (ex) {
      throw ex;
    }
  }
}

module.exports = UserService;