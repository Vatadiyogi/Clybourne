const router = require('express').Router();
const moment = require('moment');
const Plan = require('../../../../models/plan.model');

// Get all plans
router.get('/', async (req, res) => {
    try {
        const plans = await Plan.find({ isDeleted: 0 }).sort({ displaySequence: 1 });
        res.json(plans);
    } catch (err) {
        res.json({ message: err.message });
    }
});


// Get a specific plan
router.get('/:planId', async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.planId);
        res.json(plan);
    } catch (err) {
        res.json({ message: err })
    }
})

router.post('/store', async (req, res) => {
    try {
        const sequenceId = await generateSequenceId();
        const plan = new Plan({
            name: req.body.name,
            description: req.body.description,
            userplandescription: req.body.userplanddescription,
            price: req.body.price,
            planType: req.body.planType, // Make sure this field is included in the request
            reports: req.body.reports,
            accessDays: req.body.accessDays,
            displaySequence: req.body.displaySequence, // Make sure this field is included in the request
            sequenceId: sequenceId
        });

        const savedPlan = await plan.save();
        res.status(200).json({ message: "Plan added successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/edit/:id', async (req, res) => {
    const { id } = req.params; // Get the plan ID from request parameters

    try {
        const updatedPlan = {
            name: req.body.name,
            description: req.body.description,
            userplandescription: req.body.userplandescription,
            price: req.body.price,
            planType: req.body.planType,
            reports: req.body.reports,
            accessDays: req.body.accessDays,
            displaySequence: req.body.displaySequence,
            status: req.body.status !== undefined ? req.body.status : 1 // Check if status is present, if not default to 1
        };

        const options = { new: true }; // To return the updated document
        const updatedPlanDoc = await Plan.findByIdAndUpdate(id, updatedPlan, options);
        if (!updatedPlanDoc) {
            return res.status(202).json({ message: 'Plan not found' });
        }

        res.status(200).json({ message: 'Plan updated successfully', updatedPlan: updatedPlanDoc });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:planId', async (req, res) => {
    try {
        const removedPlan = await Plan.remove({ _id: req.params.planId });
        res.json(removedPlan);
    } catch (err) {
        res.json({ message: err })
    }
}
)

// Utility function to generate the next SequenceId 
const generateSequenceId = async () => {
    try {
        const lastPlan = await Plan.findOne().sort({ createdDate: -1 }).exec();
        if (lastPlan && lastPlan.sequenceId) {
            const sequenceMatch = lastPlan.sequenceId.match(/(\D+)(\d+)/);
            if (sequenceMatch) {
                const prefix = sequenceMatch[1];
                const lastNumber = parseInt(sequenceMatch[2], 10);
                const nextNumber = lastNumber + 1;
                return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
            }
        }
        return 'FIN-001'; // Default SequenceId if no plans exist
    } catch (err) {
        throw new Error('Error generating SequenceId: ' + err.message);
    }
};

module.exports = router;