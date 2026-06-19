const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // serve static files from public folder

// Data file
const DATA_FILE = path.join(__dirname, 'data.json');

// Read data from file
function readData() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify({ applications: [] }, null, 2));
    }
    const raw = fs.readFileSync(DATA_FILE);
    return JSON.parse(raw);
}

// Write data to file
function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// API endpoints
app.get('/api/applications', (req, res) => {
    const data = readData();
    res.json(data.applications);
});

app.post('/api/applications', (req, res) => {
    const data = readData();
    const newApp = req.body;
    newApp.id = Date.now();
    data.applications.push(newApp);
    writeData(data);
    res.status(201).json(newApp);
});

app.put('/api/applications/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const index = data.applications.findIndex(a => a.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Application not found' });
    }
    data.applications[index] = { ...data.applications[index], ...req.body };
    writeData(data);
    res.json(data.applications[index]);
});

app.delete('/api/applications/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    data.applications = data.applications.filter(a => a.id !== id);
    writeData(data);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
    console.log(`📁 Data stored in ${DATA_FILE}`);
});
