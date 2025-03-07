const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');
const { checkAuth } = require('./middleware/auth');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('🔥 Conectado a MongoDB'))
.catch(err => console.error('❌ Error al conectar a MongoDB:', err));

app.use('/auth', authRoutes);
app.use('/tasks', checkAuth, taskRoutes);

app.get('/', (req, res) => res.send('🚀 API Task List funcionando correctamente en Render'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`));
