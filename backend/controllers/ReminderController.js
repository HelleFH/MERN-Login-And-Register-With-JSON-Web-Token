// controllers/reminderController.js
const { Reminder } = require('../models/ReminderModel');
const { Entry } = require('../models/EntryModel');

const setReminder = async (req, res) => {
  const { date, time, description, entryId, username } = req.body;

  if (!date || !time || !description || !entryId) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const entry = await Entry.findById(entryId);
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found.' });
    }

    const newReminder = new Reminder({
      date,
      time,
      description,
      entryId,
      username,
    });

    await newReminder.save();
    res.status(201).json({ message: 'Reminder set successfully', reminder: newReminder });
  } catch (error) {
    console.error('Error setting reminder:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getRemindersByEntryId = async (req, res) => {
  try {
      const entryId = req.params.entryId;
      const reminders = await Reminder.find({ entryId });
      res.status(200).json(reminders);
  } catch (error) {
      console.error('Error fetching reminders by entry ID:', error);
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
  getRemindersByEntryId
};
