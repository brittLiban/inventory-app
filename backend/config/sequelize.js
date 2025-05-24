// config/sequelize.js
import sequelize from './db.js';
import '../models/User.js';

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to Railway PostgreSQL!');
    await sequelize.sync({ alter: true });
    console.log('🛠️  DB synced with models');
  } catch (err) {
    console.error('❌ DB connection/sync failed:', err);
  }
};

export default connectDB;