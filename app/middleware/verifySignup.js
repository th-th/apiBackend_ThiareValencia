const db = require('../models')
const User = db.users

exports.checkDuplicateEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (user) {
      return res.status(400).json({ message: 'El correo ya se encuentra registrado' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Ha ocurrido un error' });
  }
};
