const bcrypt = require('bcryptjs');
const { Usuario } = require('./src/models');

async function probar() {
  try {
    const usuario = await Usuario.findOne({
      where: { correo: 'jose@gmail.com' }
    });

    if (!usuario) {
      console.log('Usuario no encontrado');
      return;
    }

    const coincide = await bcrypt.compare(
      'pepe1234',
      usuario.contrasena_hash
    );

    console.log('Usuario:', usuario.correo);
    console.log('Empresa ID:', usuario.empresa_id);
    console.log('¿Contraseña correcta?:', coincide);
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
}

probar();
