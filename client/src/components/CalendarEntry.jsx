import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImageUpload from '../components/ImageUpload';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import handleSubmitUpdate from './HandleSubmitUpdate';
import handleDeleteEntry from './HandleDeleteEntry';
import SetCalendarReminder from './SetCalendarReminder';
import handleDeleteReminder from './HandleDeleteReminder';
import moment from 'moment';


const CalendarEntry = ({
  entry,
  onUpdateEntry,
  onDeleteEntry,
  selectedDate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEntry, setEditedEntry] = useState(entry);
  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(entry.cloudinaryUrl);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const fetchRemindersByEntryId = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/v1/reminders/entry/${entry._id}`);
        setReminders(response.data);
      } catch (error) {
        console.error('Error fetching reminders by entry ID:', error);
      }
    };

    if (entry._id) {
      fetchRemindersByEntryId();
    }
  }, [entry._id]);

  const handleChange = (e) => {
    setEditedEntry({ ...editedEntry, [e.target.name]: e.target.value });
  };

  const onDrop = (acceptedFiles) => {
    const currentFile = acceptedFiles[0];
    setFile(currentFile);

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setPreviewSrc(reader.result);
    });

    reader.readAsDataURL(currentFile);
  };

  const toggleReminderModal = () => {
    setIsReminderModalOpen(!isReminderModalOpen);
  };



  return (
    <li>
      {isEditing ? (
        <>
          <ImageUpload
            onDrop={onDrop}
            file={file}
            previewSrc={previewSrc}
            isPreviewAvailable={true}
          />
          <div>
            <label>Name:</label>
            <input type="text" name="name" value={editedEntry.name} onChange={handleChange} />
          </div>
          <div>
            <label>Notes:</label>
            <textarea name="notes" value={editedEntry.notes} onChange={handleChange} />
          </div>
          <div>
            <label>Sunlight:</label>
            <input type="text" name="sunlight" value={editedEntry.sunlight} onChange={handleChange} />
          </div>
          <div>
            <label>Watering:</label>
            <input type="text" name="watering" value={editedEntry.watering} onChange={handleChange} />
          </div>
          <button onClick={() => handleSubmitUpdate(entry._id, editedEntry, file, selectedDate, onUpdateEntry, handleDeleteEntry).then(() => setIsEditing(false))}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <p>Name: {entry.name}</p>
          <p>Notes: {entry.notes}</p>
          <p>Sunlight: {entry.sunlight}</p>
          <p>Watering: {entry.watering}</p>
          {entry.cloudinaryUrl && <img src={entry.cloudinaryUrl} alt={entry.name} />}
          <button onClick={() => setIsEditing(true)}>Edit Entry</button>
          <button onClick={toggleReminderModal}>Set Reminder</button>
          <button onClick={() => {
            setIdToDelete(entry._id);
            setShowDeleteModal(true);
          }}>Delete Entry</button>

          {showDeleteModal && (
            <DeleteConfirmationModal
              isOpen={showDeleteModal}
              onCancel={() => setShowDeleteModal(false)}
              onConfirm={async () => {
                await handleDeleteEntry(idToDelete, onDeleteEntry);
                setShowDeleteModal(false);
              }}
            />
          )}

          <SetCalendarReminder isOpen={isReminderModalOpen} onClose={toggleReminderModal} date={selectedDate} entryId={entry._id} username={username} />
          
          <p>Reminders:</p>
          <ul>
  {reminders.map((reminder) => (
    <li key={reminder._id}>
      {moment(reminder.date).format('MMMM Do YYYY, h:mm:ss a')}
      <button onClick={() => handleDeleteReminder(reminder._id)}>Delete Reminder</button>
    </li>
  ))}
</ul>

        </>
      )}
    </li>
  );
};

export default CalendarEntry;