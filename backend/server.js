import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Smart Railway QR Parking API is running' });
});

// Parking slots endpoints (placeholder - actual data comes from Supabase)
app.get('/api/slots', (req, res) => {
    res.json({
        slots: [
            { id: 1, slot_number: 1, is_occupied: false },
            { id: 2, slot_number: 2, is_occupied: true },
            { id: 3, slot_number: 3, is_occupied: false },
            { id: 4, slot_number: 4, is_occupied: false },
            { id: 5, slot_number: 5, is_occupied: true },
        ]
    });
});

// Parking rate endpoint
app.get('/api/rate', (req, res) => {
    res.json({
        ratePerHour: 10,
        currency: 'INR',
        currencySymbol: '₹'
    });
});

// Calculate parking fee
app.post('/api/calculate-fee', (req, res) => {
    const { entryTime, exitTime } = req.body;

    const entry = new Date(entryTime);
    const exit = new Date(exitTime);
    const hours = Math.ceil((exit - entry) / (1000 * 60 * 60));
    const ratePerHour = 10;
    const total = hours * ratePerHour;

    res.json({
        hours,
        ratePerHour,
        total,
        currency: 'INR'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Smart Railway QR Parking API running on port ${PORT}`);
});