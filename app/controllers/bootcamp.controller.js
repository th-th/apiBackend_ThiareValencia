const {
  users,
  bootcamps
} = require('../models')
const db = require('../models')
const Bootcamp = db.bootcamps
const User = db.users

// Crear y guardar un nuevo bootcamp
exports.createBootcamp = (req, res) => {
  if(!req.body.title || !req.body.cue || !req.body.description) {
    res.status(400).send({
      message: "Los campos son requeridos y no vacíos!"
    });
    return;
  }

  const bootcamp = {
    title: req.body.title,
    cue: req.body.cue,
    description: req.body.description
  }

  return Bootcamp.create(bootcamp)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Algun error ha ocurrido en la creación del bootcamp."
      })
  });
}

// Agregar un Usuario al Bootcamp
exports.addUser = async (req, res) => {
  if(!req.body.bootcampId || !req.body.userId) {
    res.status(400).send({
      message: "Los campos son requeridos y no vacíos!"
    });
    return;
  }

  try {
    const bootcamp = await Bootcamp.findByPk(req.body.bootcampId);

    if(!bootcamp) {
      res.status(400).send({
        message: "No se encontró el bootcamp!"
      });

      return;
    }

    const user = await User.findByPk(req.body.userId)
    
    if (!user) {
      res.status(400).send({
        message: "No se encontró el usuario!"
      });

      return;
    }

    await bootcamp.addUser(user);
    
    res.send(bootcamp)
  } catch(err) {
    res.status(500).send({
      message: err.message || "Algun error ha ocurrido al agregar al usuario al bootcamp."
    })
  }
};


// obtener los bootcamp por id 
exports.findById = async (req, res) => {
  if(!req.params.id) {
    res.status(400).send({
      message: "No se puede encontrar un bootcamp sin la ID!"
    });
    return;
  }

  const bootcampId = req.params.id;

  try {
    const bootcamp = await Bootcamp.findByPk(bootcampId, {
      include: [{
        model: User,
        as: "users",
        attributes: ["id", "firstName", "lastName"],
        through: {
          attributes: [],
        }
      }, ],
    })

    if(!bootcamp) {
      throw { message: "Bootcamp no encontrado" }
    }

    res.send(bootcamp);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Algun error ha ocurrido al tratar de obtener el bootcamp."
    })
  }
}

// obtener todos los Usuarios incluyendo los Bootcamp
exports.findAll = async (req, res) => {
  try { 
    const bootcamps = await Bootcamp.findAll({
      include: [{
        model: User,
        as: "users",
        attributes: ["id", "firstName", "lastName"],
        through: {
          attributes: [],
        }
      }, ],
    })

    res.send(bootcamps)
  } catch (error) {
    res.status(500).send({
      message: error.message || "Algun error ha ocurrido al tratar de obtener los bootcamps."
    })
  }
}