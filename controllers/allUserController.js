
const dbconnect = require('../config/database');
const Application = require('../model/application');
const FundingOpportunity = require('../model/fundingOpportunity');



exports.getSingleUserData = async (req, res) => {
    try {
        const { id } = req.params;
        const application = await Application.findById(id);
        const fundingOpportunity = await FundingOpportunity.findById(id);
        if (application === null) {
            res.json({ fundingOpportunity });
        } else if (fundingOpportunity === null) {
            res.json({ application });
        } else {

            // res.json({ message: 'single User fetch successfully'});
            res.json({ application, fundingOpportunity });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }


}


// Get all user information
exports.getAllUserData = async (req, res) => {
    try {
        const application = await Application.find();
        // const result = await
        // console.log(application);
        const fundingOpportunity = await FundingOpportunity.find();

        res.json({ application, fundingOpportunity });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create user information
exports.createUser = async (req, res) => {
    console.log(req.body)
    try {
        const { application } = req.body;
        // Create instances of each schema and save to the database
        const newApplication = new Application(req.body);
        console.log(newApplication);
        const newFundingOpportunity = new FundingOpportunity(req.body);
        console.log(newFundingOpportunity);

        await newFundingOpportunity.save();
        await newApplication.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user information
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Update instances of each schema
        await Application.findByIdAndUpdate(id, req.body);
        await FundingOpportunity.findByIdAndUpdate(id, req.body);

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete user information
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Delete instances of each schema
        await Application.findByIdAndDelete(id);
        await FundingOpportunity.findByIdAndDelete(id);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};
