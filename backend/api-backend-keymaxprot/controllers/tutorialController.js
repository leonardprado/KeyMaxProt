const Tutorial = require('../models/Tutorial');
const User = require('../models/User');

// Crear nuevo tutorial
exports.crearTutorial = async (req, res) => {
  try {
    // Solo admins y técnicos pueden crear tutoriales
    if (!['admin', 'tecnico'].includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para crear tutoriales'
      });
    }

    const tutorial = await Tutorial.create({
      ...req.body,
      autor: req.user.id
    });

    res.status(201).json({
      success: true,
      tutorial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear tutorial',
      error: error.message
    });
  }
};

// Obtener todos los tutoriales
exports.getTutoriales = async (req, res) => {
  try {
    const { categoria, nivel, busqueda } = req.query;
    let query = {};

    if (categoria) query.categoria = categoria;
    if (nivel) query.nivel = nivel;
    if (busqueda) {
      query.$or = [
        { titulo: { $regex: busqueda, $options: 'i' } },
        { descripcion: { $regex: busqueda, $options: 'i' } },
        { etiquetas: { $regex: busqueda, $options: 'i' } }
      ];
    }

    const tutoriales = await Tutorial.find(query)
      .populate('autor', 'nombre apellido')
      .sort({ fechaPublicacion: -1 });

    res.status(200).json({
      success: true,
      count: tutoriales.length,
      tutoriales
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener tutoriales',
      error: error.message
    });
  }
};

// Obtener un tutorial específico
exports.getTutorial = async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id)
      .populate('autor', 'nombre apellido')
      .populate('comentarios.usuario', 'nombre apellido');

    if (!tutorial) {
      return res.status(404).json({
        success: false,
        message: 'Tutorial no encontrado'
      });
    }

    // Incrementar vistas
    await tutorial.incrementarVistas();

    res.status(200).json({
      success: true,
      tutorial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener tutorial',
      error: error.message
    });
  }
};

// Actualizar tutorial
exports.actualizarTutorial = async (req, res) => {
  try {
    let tutorial = await Tutorial.findById(req.params.id);

    if (!tutorial) {
      return res.status(404).json({
        success: false,
        message: 'Tutorial no encontrado'
      });
    }

    // Verificar autorización
    if (tutorial.autor.toString() !== req.user.id && req.user.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para actualizar este tutorial'
      });
    }

    tutorial = await Tutorial.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      tutorial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar tutorial',
      error: error.message
    });
  }
};

// Eliminar tutorial
exports.eliminarTutorial = async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);

    if (!tutorial) {
      return res.status(404).json({
        success: false,
        message: 'Tutorial no encontrado'
      });
    }

    // Verificar autorización
    if (tutorial.autor.toString() !== req.user.id && req.user.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para eliminar este tutorial'
      });
    }

    await tutorial.remove();

    res.status(200).json({
      success: true,
      message: 'Tutorial eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar tutorial',
      error: error.message
    });
  }
};

// Añadir comentario
exports.agregarComentario = async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);

    if (!tutorial) {
      return res.status(404).json({
        success: false,
        message: 'Tutorial no encontrado'
      });
    }

    const nuevoComentario = {
      usuario: req.user.id,
      texto: req.body.texto,
      calificacion: req.body.calificacion
    };

    tutorial.comentarios.push(nuevoComentario);
    await tutorial.save();

    res.status(200).json({
      success: true,
      tutorial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al agregar comentario',
      error: error.message
    });
  }
};

// Marcar tutorial como completado
exports.marcarCompletado = async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);

    if (!tutorial) {
      return res.status(404).json({
        success: false,
        message: 'Tutorial no encontrado'
      });
    }

    await tutorial.marcarCompletado(req.body.tiempoCompletado);

    // Actualizar lista de tutoriales vistos del usuario
    await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { tutorialesVistos: req.params.id } }
    );

    res.status(200).json({
      success: true,
      message: 'Tutorial marcado como completado'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al marcar tutorial como completado',
      error: error.message
    });
  }
};

// Votar utilidad de comentario
exports.votarComentario = async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);

    if (!tutorial) {
      return res.status(404).json({
        success: false,
        message: 'Tutorial no encontrado'
      });
    }

    const comentario = tutorial.comentarios.id(req.params.comentarioId);

    if (!comentario) {
      return res.status(404).json({
        success: false,
        message: 'Comentario no encontrado'
      });
    }

    // Actualizar votos
    if (req.body.voto === 'positivo') {
      comentario.utilidad.votosPositivos += 1;
    } else if (req.body.voto === 'negativo') {
      comentario.utilidad.votosNegativos += 1;
    }

    await tutorial.save();

    res.status(200).json({
      success: true,
      comentario
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al votar comentario',
      error: error.message
    });
  }
};