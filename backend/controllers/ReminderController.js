const { Reminder } = require('../models/ReminderModel');
const { Entry } = require('../models/EntryModel');
const mongoose = require('mongoose');

const setReminder = async (req, res) => {
  const { date, time, description, entryID, userID, name } = req.body;

  try {
    const entry = await Entry.findById(entryID);
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found.' });
    }

    const newReminder = new Reminder({
      name,
      date,
      time,
      description,
      entryID,
      userID,
    });

    await newReminder.save();
    res.status(201).json({ message: 'Reminder set successfully', reminder: newReminder });
  } catch (error) {
    console.error('Error setting reminder:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getRemindersByDate = async (req, res) => {
  try {
    // Extract date and username from request parameters
    const { date } = req.params;
    const { userID } = req.query;

    // Parse date string into JavaScript Date object
    const searchDate = new Date(date);

    // Get entries for the specified date and username
    const entries = await Reminder.find({
      date: {
        $gte: searchDate,
        $lt: new Date(searchDate.getTime() + 24 * 60 * 60 * 1000)
      },
      userID: userID // Add username as a condition
    });

    // Send entries as response
    res.json(entries);
  } catch (error) {
    console.error('Error in getting entries by date:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

const getRemindersByEntryId = async (req, res) => {
  try {
    const { entryID } = req.params;
    console.log(entryID)

    // Check if entryID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(entryID)) {
      return res.status(400).json({ error: 'Invalid entryID.' });
    }

    const objectId = new mongoose.Types.ObjectId(entryID);

    const reminders = await Reminder.find({ entryID: objectId });
    res.json(reminders);
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const deleteReminder = async (req, res) => {
  const { id } = req.params;
  
    try {
      const deletedReminder = await Reminder.findByIdAndDelete(id);
  
      if (!deletedReminder) {
        return res.status(404).json({ error: 'Entry not found' });
      }
  
  
      res.json({ message: 'Reminder deleted successfully', deletedReminder });
    } catch (error) {
      console.error('Error deleting reminder:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

module.exports = {
  setReminder,
  deleteReminder,
  getRemindersByEntryId,
  getRemindersByDate
};
