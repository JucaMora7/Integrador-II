const { sequelize, Rol } = require('../models');

const ROLES = ['Propietario', 'Empleado'];

async function seedRoles() {
  await sequelize.authenticate();
  await sequelize.sync();
  for (const nombre of ROLES) {
    await Rol.findOrCreate({ where: { nombre } });
  }
  console.log('Roles listos:', ROLES.join(', '));
  await sequelize.close();
}

seedRoles().catch((err) => {
  console.error('Error al crear roles:', err.message);
  process.exit(1);
});
