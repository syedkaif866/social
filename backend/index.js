// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const submissionRoutes = require('./routes/submissionRoutes');
const fileUpload = require("express-fileupload");
const router = express.Router();
const {  getSubmissions } = require('./controllers/submissionController');

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors(
  {
    origin: '*',
    credentials: true,
  }
));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)
// Routes
app.use('/api', submissionRoutes);

// Admin login route

// Middleware to protect admin routes


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
