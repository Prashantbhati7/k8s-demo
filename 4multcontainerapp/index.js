import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/k8s-demo';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let isDatabaseReady = false;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});



const Email = mongoose.model('Email', {
    email: String,
});



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/add-email', async (req, res) => {
    if (!isDatabaseReady) {
        return res.status(503).json({ message: 'Database is not connected yet' });
    }

    const { email } = req.body;
    try {
        const newEmail = new Email({ email });
        await newEmail.save();
        res.status(201).json({ message: 'Email added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding email' });
    }
});

app.get('/emails', async (req, res) => {
    if (!isDatabaseReady) {
        return res.status(503).json({ message: 'Database is not connected yet' });
    }

    try {
        const emails = await Email.find({});
        res.json(emails);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching emails' });
    }
});

app.get('/exit', (req, res) => {
    // Perform actions to stop the server or any other desired actions
    res.send('Server stopped');
    process.exit(0); // This stops the server (not recommended in production)
});

// Start server
const init = async () => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    try {
        await mongoose.connect(MONGO_URI);
        isDatabaseReady = true;
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
    }
}

init();
