const app = require('./src/app');
const { sequelize } = require('./src/models');
const env = require('./src/config/env');

async function iniciar() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Conexión a PostgreSQL establecida y modelos sincronizados.');

    app.listen(env.port, () => {
      console.log(`API del SGI escuchando en http://localhost:${env.port}`);
    });
  } catch (err) {
    console.error('No fue posible iniciar el servidor:', err.message);
    process.exit(1);
  }
}

iniciar();
