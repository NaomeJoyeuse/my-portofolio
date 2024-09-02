
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/routes");
const userRoutes = require("./routes/UserRoutes");
const passport = require('passport');
require('./Utilities/passport_configuration');

const  swaggerjsdoc = require('swagger-jsdoc');
const swaggerui = require('swagger-ui-express');
const swaggerDocs = require("./Utilities/swagger.ts");

const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use('/api', routes);
app.use('/api', userRoutes);
app.get('/test', (req, res) => res.status(200).json({ message: 'Test route' }));


// mongoose
//         .connect("mongodb://localhost:27017/blog_db1")
//         .then(()=>{
           
//     swaggerDocs(app, 5000)
//     app.listen(5000, () => {
//         console.log("Server has started!")
//     })
// })
// module.exports = app;
const dburl= 'mongodb+srv://naome:12345@cluster0.xwjej.mongodb.net/blogdb?retryWrites=true&w=majority'
async function startServer() {
    try {
      await mongoose.connect(dburl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB');
  
      swaggerDocs(app, 5000); // Initialize Swagger
  
      const server = app.listen(5000, () => {
        console.log('Server has started on port 5000!');
      });
  
      // Export the server instance so it can be closed in tests
      return server;
    } catch (error) {
      console.error('Error starting the server:', error);
    }
  }
  
  // Only start the server if this script is run directly
  if (require.main === module) {
    startServer();
  }
  
  module.exports = { app, startServer };