// config/db.js
import { Sequelize } from 'sequelize';

// Replace with your actual connection string from Railway
const sequelize = new Sequelize('postgresql://postgres:ouxLrOJLbYAgdCiPeOQKRSUduMdHnjlS@trolley.proxy.rlwy.net:52607/railway', {
  dialect: 'postgres',
  logging: false,
});

export default sequelize;
