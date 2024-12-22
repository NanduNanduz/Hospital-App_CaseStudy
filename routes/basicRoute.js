const express = require('express'); // import express
const fs = require('fs').promises; // import filesystem(promise-based file handling:Use the promises API of fs)
const path = require('path'); //import path
const router = express.Router(); //creating a router level middleware


const jsonFilePath = path.join(__dirname, "../hospitalData.json");

// Read JSON file
async function readJSONFile() {
  try {
    const data = await fs.readFile(jsonFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading file:', err);
    throw err;
  }
}

// Write to JSON file
async function writeJSONFile(data) {
  try {
    await fs.writeFile(jsonFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to file:', err);
    throw err;
  }
}

// CRUD Operations

// 1. GET: Fetch all hospitals

router.get('/hospitalsData', async (req, res) => {
  try {
    const hospitals = await readJSONFile();
    res.status(200).json(hospitals);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching hospitals', error: err.message });
  }
});

// 2. POST: Add a new hospital

router.post('/addHospitals', async (req, res) => {
  try {
    const hospitals = await readJSONFile();
    const newHospital = req.body;

    // Assign a unique ID to the new hospital
    newHospital.id = hospitals.length ? hospitals[hospitals.length - 1].id + 1 : 1;

    hospitals.push(newHospital);
    await writeJSONFile(hospitals);

    res.status(201).json({ message: 'Hospital added successfully', data: newHospital });
  } catch (err) {
    res.status(500).json({ message: 'Error adding hospital', error: err.message });
  }
});

// 3. PUT: Update an existing hospital by ID

router.put('/editHospitals/:id', async (req, res) => {
  try {
    const hospitalId = parseInt(req.params.id, 10);
    const hospitals = await readJSONFile();
    const index = hospitals.findIndex(h => h.id === hospitalId);

    if (index !== -1) {
      hospitals[index] = { ...hospitals[index], ...req.body }; // Update hospital details
      await writeJSONFile(hospitals);

      res.status(200).json({ message: 'Hospital updated successfully', data: hospitals[index] });
    } else {
      res.status(404).json({ message: 'Hospital not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error updating hospital', error: err.message });
  }
});

// 4. DELETE: Remove a hospital by ID

router.delete('/removeHospitals/:id', async (req, res) => {
  try {
    const hospitalId = parseInt(req.params.id, 10);
    const hospitals = await readJSONFile();
    const filteredHospitals = hospitals.filter(h => h.id !== hospitalId);

    if (filteredHospitals.length !== hospitals.length) {
      await writeJSONFile(filteredHospitals);
      res.status(200).json({ message: 'Hospital deleted successfully' });
    } else {
      res.status(404).json({ message: 'Hospital not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error deleting hospital', error: err.message });
  }
});


module.exports = router;






