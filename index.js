const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./config');
const path = require('path');
const routes = require('./routes');
const cors = require('cors');
const fileUpload = require('express-fileupload');




// Serve static files from the public directory
// Add this line to debug static file serving

app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

mongoose.connect(config.mongoURI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

//middleware
app.use(cors());
app.use(express.json());
app.use('/api', routes);

// // Basic static file serving
// app.use(express.static(path.join(__dirname, 'public')));

// // Advanced static file configuration with options
// app.use('/static', express.static(path.join(__dirname, 'public'), {
//   // Set proper MIME types for different file extensions
//   setHeaders: (res, path, stat) => {
//     if (path.endsWith('.js')) {
//       res.set('Content-Type', 'application/javascript');
//     } else if (path.endsWith('.css')) {
//       res.set('Content-Type', 'text/css');
//     } else if (path.endsWith('.html')) {
//       res.set('Content-Type', 'text/html');
//     }
//   },
//   // Enable file caching for better performance
//   maxAge: '1d', // Cache static files for 1 day
//   // Show directory listing if no index file is found
//   index: false,
//   // Enable compression for static files
//   compress: true,
//   // Enable strict routing
//   strict: true,
//   // Enable ETag for caching
//   etag: true,
//   // Disable dotfiles serving
//   dotfiles: 'ignore',
//   // Enable Last-Modified header
//   lastModified: true,
//   // Redirect all HTTP requests to HTTPS
//   redirect: true
// }));


// app.use('/js', express.static(path.join(__dirname, 'public/js'), {
//   setHeaders: (res, path) => {
//     res.set('Content-Type', 'application/javascript');
//   },
//   maxAge: '1h' // Cache JS files for 1 hour
// }));

// app.use('/css', express.static(path.join(__dirname, 'public/css'), {
//   setHeaders: (res, path) => {
//     res.set('Content-Type', 'text/css');
//   }
// }));

// app.use('/images', express.static(path.join(__dirname, 'images'), {
//   maxAge: '7d' // Cache images for 7 days
// }));


// // Enable CORS
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });

app.use('/js', (req, res, next) => {
  res.type('application/javascript');
  next();
});

app.use((req, res, next) => {
  console.log('Request URL:', req.url);
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));