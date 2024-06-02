import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';
import handleSubmitUpdate from '../HandleSubmitUpdate';
import handleDeleteEntry from '../HandleDeleteEntry';
import SetCalendarReminder from '../SetReminderComponent/SetCalendarReminder';
import handleDeleteReminder from '../HandleDeleteReminder';
import moment from 'moment';
import styles from '../CalendarEntryComponent/CalendarEntryComponent.module.scss';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Make sure this is included
import axiosInstance from '../axiosInstance';

const CalendarEntry = ({ entry, onUpdateEntry, onDeleteEntry, selectedDate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editedEntry, setEditedEntry] = useState(entry);
  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(entry.cloudinaryUrl);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [reminders, setReminders] = useState([]);

  const contentRef = useRef(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const fetchRemindersByEntryId = async () => {
      try {
        const response = await axiosInstance.get(`/reminders/entry/${entry._id}`);
        setReminders(response.data);
      } catch (error) {
        console.error('Error fetching reminders by entry ID:', error);
      }
    };

    if (entry._id) {
      fetchRemindersByEntryId();
    }
  }, [entry._id, setReminders]);

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

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSave = async () => {
    await handleSubmitUpdate(entry._id, editedEntry, file, selectedDate, onUpdateEntry, handleDeleteEntry);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedEntry(entry);
    setIsEditing(false);
  };

  return (
    <li className={styles.CalendarEntry}>
      <div className="flex-row">
        <h4 onClick={toggleExpand} className={styles.entryName}>
          {entry.name}
        </h4>
        <i
          onClick={toggleExpand}
          className={`fas ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'} ${styles.chevron}`}
        ></i>
      </div>

      <div
        className={` ${styles.entryDetails} ${isExpanded ? styles.expanded : ''}`}
        ref={contentRef}
        style={
          isExpanded
            ? { height: contentRef.current.scrollHeight }
            : { height: 0 }
        }
      >
        <div className={styles.lineContainer}>
          <hr className="long-line"></hr>
        </div>

        {entry.cloudinaryUrl && <img src={entry.cloudinaryUrl} alt={entry.name} />}

        <div className={styles.lineContainer}>
          <hr className="long-line"></hr>
        </div>

        <div className={styles.EntryFormContainer}>
          <div>
            <label>Name:</label>
            {isEditing ? (
              <input type="text" name="name" value={editedEntry.name} onChange={handleChange} />
            ) : (
              <span> {entry.name}</span>
            )}
          </div>

          <div>
            <label>Sunlight:</label>
            {isEditing ? (
              <input type="text" name="sunlight" value={editedEntry.sunlight} onChange={handleChange} />
            ) : (
              <span> {entry.sunlight}</span>
            )}
          </div>
          <div>
            <label>Water:</label>
            {isEditing ? (
              <input type="text" name="water" value={editedEntry.water} onChange={handleChange} />
            ) : (
              <span> {entry.water}</span>
            )}
          </div>
          <div>
            <label>Notes:</label>
            {isEditing ? (
              <textarea name="notes" value={editedEntry.notes} onChange={handleChange} />
            ) : (
              <span> {entry.notes}</span>
            )}
          </div>
        </div>

        <div className='flex-row'>
          {isEditing ? (
            <>
              <div className='flex-row margin-top'>
                <Link onClick={handleCancel}>Cancel</Link>
                <button className="primary-button" onClick={handleSave}>Save</button>
              </div>
            </>
          ) : (
            <>
              <Link
                className="margin-top"
                onClick={() => {
                  setIdToDelete(entry._id);
                  setShowDeleteModal(true);
                }}
              >
                Delete
              </Link>

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

              <button className="primary-button margin-top" onClick={() => setIsEditing(true)}>Edit Entry</button>
            </>
          )}
        </div>

        <div className={styles.lineContainer}>
          <hr className="long-line"></hr>
        </div>

        <SetCalendarReminder
          isOpen={isReminderModalOpen}
          onClose={toggleReminderModal}
          date={selectedDate}
          entryId={entry._id}
          username={username}
        />
        <div className='flex-row'>
          <h4>Reminders:</h4>
          <button className="secondary-button" onClick={toggleReminderModal}>
            <i className="fas fa-bell"></i> Set Reminder
          </button>
        </div>
        <ul className='flex-right margin-top'>
          {reminders.map((reminder) => (
            <li className="flex-row" key={reminder._id}>
              <span>
                {moment(reminder.date).format('MMMM Do YYYY')} - {reminder.description}
              </span>
              <span>
                <i
                  className="fas fa-trash"
                  onClick={() => handleDeleteReminder(reminder._id)}
                  style={{ cursor: 'pointer', marginLeft: '10px' }}
                ></i>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};

export default CalendarEntry;
