const express = require('express'); // import express
const app = new express; // instance of express

const path = require("path"); //import path

const basicRouts = require('./routes/basicRoute');// import router
app.use('/hospital', basicRouts);




app.listen(3000, () => {
  console.log("Server is running");
});
