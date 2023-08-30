const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const db = require('../models')
const secretKey = require("../config/auth.config");
const User = db.users
const Bootcamp = db.bootcamps

function createJWT(userId) {
  return new Promise((resolve, reject) => {
    jwt.sign({ userId }, secretKey, {}, (err, token) => {
      if(err) {
        reject("Error al crear la token: " + err);
      }

      resolve(token);
    });
  })
}

// Crear y Guardar Usuarios
exports.createUser = (req, res) => {
  if(!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
    res.status(400).send({
      message: "Los campos son requeridos y no vacíos!"
    });
    return;
  }

  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
  }

  return User.create(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Algun error ha ocurrido en la creación del usuario."
      })
    })
}

// Iniciar sesion
exports.signin = async (req, res) => {
  if(!req.body.email || !req.body.password) {
    res.status(400).send({
      message: "Los campos son requeridos y no vacíos!"
    });
    return;
  }

  const user = await User.findOne({ where: { email: req.body.email } });

  if(!user) {
    res.status(400).send({
      message: "Usuario o contraseña inválidos"
    });
    return;
  }

  const authenticated = await bcrypt.compare(req.body.password, user.password);
  
  if(!authenticated) {
    res.status(400).send({
      message: "Usuario o contraseña inválidos"
    });
    return;
  }

  const token = await createJWT(user.id);

  res.send({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    accessToken: token
  });
}

// obtener los bootcamp de un usuario
exports.findUserById = async (req, res) => {
  if(!req.params.id) {
    res.status(400).send({
      message: "No se puede encontrar un usuario sin la ID!"
    });
    return;
  }

  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId, {
      include: [{
        model: Bootcamp,
        as: "bootcamps",
        attributes: ["id", "title"],
        through: {
          attributes: [],
        }
      }, ],
    })

    if(!user) {
      throw { message: "Usuario no encontrado" }
    }

    res.send({
      id: user.id,
      firstName: user.firstName, 
      lastName: user.lastName,
      email: user.email, 
      bootcamps: user.bootcamps,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Algun error ha ocurrido al tratar de obtener al usuario."
    })
  }
}

// obtener todos los Usuarios incluyendo los bootcamp
exports.findAll = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{
        model: Bootcamp,
        as: "bootcamps",
        attributes: ["id", "title"],
        through: {
          attributes: [],
        }
      }, ],
    })

    res.send(users)
  } catch (error) {
    res.status(500).send({
      message: error.message || "Algun error ha ocurrido al tratar de obtener los usuarios."
    })
  }
}

// Actualizar usuarios
exports.updateUserById = async (req, res) => {
  if(!req.params.id || !req.body.firstName || !req.body.lastName) {
    res.status(400).send({
      message: "Los campos son requeridos y no vacíos!"
    });
    return;
  }

  try {
    await User.update({
      firstName: req.body.firstName,
      lastName: req.body.lastName
    }, {
      where: {
        id: req.params.id
      }
    })

    res.send({
      message: "Usuario actualizado con éxito"
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Algun error ha ocurrido al tratar de editar al usuario."
    })
  }
}

// Eliminar usuario
exports.deleteUserById = async (req, res) => {
  if(!req.params.id) {
    res.status(400).send({
      message: "No se puede eliminar un usuario sin la ID!"
    });
    return;
  }

  const userId = req.params.id;

  try {
    await User.destroy({
      where: {
        id: userId
      }
    })

    res.send({
      message: `Se ha eliminado el usuario: ${userId}`
    })
  } catch (error) {
    res.status(500).send({
      message: error.message || "Algun error ha ocurrido al tratar de eleminar al usuario."
    })
  }
}