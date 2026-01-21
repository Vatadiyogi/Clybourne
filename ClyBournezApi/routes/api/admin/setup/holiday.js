const router = require('express').Router();
const Holiday = require('../../../../models/holiday.model');

// GET holidays for a particular year
router.get('/holidays', async (req, res) => {
    const { year } = req.query; // Extract year from query parameter

    try {
        const startOfYear = new Date(year, 0, 1); // January 1st of the year
        const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999); // December 31st of the year

        // Find holidays within the specified year
        const holidays = await Holiday.find({
            date: {
                $gte: startOfYear,
                $lte: endOfYear
            }
        }).sort({ date: 1 });

        if (holidays.length === 0) {
            return res.status(201).json({ message: `No holidays found for the year ${year}` });
        }

        // Transform holidays to include slNo and formatted date
        const transformedHolidays = holidays.map((holiday, index) => ({
            slNo: index + 1,
            dateFormatted: formatDate(holiday.date),
            day: holiday.day,
            description: holiday.description,
            id : holiday._id
        }));

        res.status(200).json(transformedHolidays);
    } catch (error) {
        console.error('Error fetching holiday data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Helper function to format date as "d-M-y" (e.g., 26-Jan-24)
function formatDate(date) {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options).replace(/ /g, '-');
}

// POST new holiday
router.post('/holidays', async (req, res) => {
    const { date, day, description } = req.body; // Ensure date is passed in d-m-Y format

    try {
        
        // Check if holiday with the same date already exists
        const existingHoliday = await Holiday.findOne({ date: date });
        if (existingHoliday) {
            return res.status(202).json({ message: "Holiday already exists" });
        }

        // Create new holiday entry
        const newHoliday = new Holiday({
            date: date, // Ensure date is stored as String in d-m-Y format
            day: day, // Day of the week
            description: description
        });

        const savedHoliday = await newHoliday.save();
        res.status(200).json({ message: "Holiday saved successfully" });
    } catch (error) {
        console.error('Error saving holiday:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Delete the holiday
router.delete('/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        const removedHoliday = await Holiday.findByIdAndDelete(req.params.id);
        if (!removedHoliday) {
            return res.status(404).json({ message: 'Holiday not found' });
        }
        res.status(200).json(removedHoliday);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
