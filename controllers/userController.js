function UserController(db) {
  this._database = db;
}

UserController.prototype.setDatabase = function setDatabase(db) {
  this._database = db;
};

UserController.prototype.findUserByEmail = function findUserByEmail(email, callback) {
  this._database.collection('komoners').findOne({email: email}, callback);
};

UserController.prototype.findUserById = function findUserById(userId, callback) {
  this._database.collection('komoners').find({ _id: userId }).toArray(callback);
};

module.exports = UserController;