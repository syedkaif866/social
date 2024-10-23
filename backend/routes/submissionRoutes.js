const express = require('express');
const { createSubmission, getSubmissions } = require('../controllers/submissionController');
const router = express.Router();

const adminCredentials = {
    username: 'admin',
    password: 'password123', 
  };
  

// POST route to submit data
router.post('/submit', createSubmission);

// GET route to fetch submissions
router.get('/submissions', getSubmissions);

router.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
  
    // Check if the credentials match
    if (username === adminCredentials.username && password === adminCredentials.password) {
      res.json({ success: true ,
        data:{
          username: username,
          password: password
        }
      });
    } else {
      res.json({ success: false });
    }
  });


  
const isAdminAuthenticated = (req, res, next) => {
    if (req.session && req.session.admin) {
      next();
    } else {
      res.redirect('/admin/login');
    }
  };

  

  
  // Apply this middleware to the dashboard route
  router.get('/admin/dashboard', isAdminAuthenticated,getSubmissions);



 

module.exports = router;
