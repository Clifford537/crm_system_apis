require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const userRoutes = require('./routes/user.routes');
const setupSwaggerDocs = require('./swagger');

const app = express();

app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/users', userRoutes);
setupSwaggerDocs(app);

sequelize.sync({ alter: true }).then(() => {
  console.log('DB synced');
  app.listen(5000, () => console.log('🚀 Server on http://localhost:5000'));
}).catch((err) => {
  console.error('DB error:', err);
});
