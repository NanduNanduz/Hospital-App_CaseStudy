const express = require('express'); // import express
const app = new express; // instance of express

const path = require("path"); //import path

app.use(express.json()); // Middleware to parse JSON and URL-encoded data
app.use(express.urlencoded({ extended: true }));


const basicRoutes = require("./routes/basicRoute"); // import router
app.use("/hospital", basicRoutes);

app.listen(3000, () => {
  console.log("Server is running");
});
