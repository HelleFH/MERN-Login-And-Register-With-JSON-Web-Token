import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import moment from 'moment';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';
import handleDeleteReminder from '../../Utils/HandleDeleteReminder';
import { Link } from 'react-router-dom';
import styles from './CalendarReminder.module.scss';

const CalendarReminder = ({
  reminder,
  setReminders,
  onSelectDate,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [entryDetails, setEntryDetails] = useState(null);

  useEffect(() => {
    const fetchEntryDetails = async () => {
      try {
        const response = await axiosInstance.get(`/entries/${reminder.entryId}`);
        setEntryDetails(response.data);
      } catch (error) {
        console.error('Error fetching entry details:', error);
      }
    };

    if (reminder.entryId) {
      fetchEntryDetails();
    }
  }, [reminder.entryId]);

  const formatDate = (date) => {
    return moment(date).format('MMMM Do');
  };

  const handleGoToDate = (event) => {
    event.preventDefault();
    if (onSelectDate && entryDetails && entryDetails.date) {
      onSelectDate(new Date(entryDetails.date));
    }
  };

  const handleDeleteReminderSuccess = (deletedReminderId) => {
    setReminders((prevReminders) => prevReminders.filter((reminder) => reminder._id !== deletedReminderId));
  };

  return (
    <li className={styles.ReminderItem}>
      {entryDetails ? (
        <>
          <i className="fas fa-xs fa-bell"></i>
          <p>
            {entryDetails.name} (
            <Link to="#" onClick={handleGoToDate}>
              {formatDate(entryDetails.date)}
            </Link>
            ): <span>{reminder.description}</span>
          </p>
        </>
      ) : (
        <p></p> // Display a loading state while fetching entry details
      )}

      <div
        onClick={() => {
          setIdToDelete(reminder._id);
          setShowDeleteModal(true);
        }}
      >
        <i
          className="fas fa-trash"
          style={{ cursor: 'pointer', marginLeft: '10px' }}
        ></i>
      </div>

      {showDeleteModal && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={async () => {
            await handleDeleteReminder(idToDelete, handleDeleteReminderSuccess);
            setShowDeleteModal(false);
          }}
        />
      )}
    </li>
  );
};

export default CalendarReminder;