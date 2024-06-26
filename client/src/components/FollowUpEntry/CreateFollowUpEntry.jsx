import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomModal from '../CustomModal/CustomModal';
import axiosInstance from '../axiosInstance';
import { Form } from 'react-bootstrap';
import ImageUpload from '../imageUpload';
import styles from './CreateFollowUpEntry.module.scss';

const NewFollowUpEntry = ({ isOpen, onClose, oldEntryID, oldEntryName, oldEntryDate, name, selectedDate, handleAddFollowUpEntry }) => {
    const [file, setFile] = useState(null);
    const [followUpDate, setFollowUpDate] = useState('');
    const [previewSrc, setPreviewSrc] = useState('');
    const [isPreviewAvailable, setIsPreviewAvailable] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();
    const initialFollowUpState = {
        notes: '',
    };
    const [followUpEntry, setFollowUpEntry] = useState(initialFollowUpState);

    // Set initial followUpDate from selectedDate prop
    useEffect(() => {
        if (selectedDate) {
            // Convert selectedDate to YYYY-MM-DD format
            const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
            setFollowUpDate(formattedDate);
        }
    }, [selectedDate]);

    const CreateFollowUpEntry = async () => {
        try {
            const formData = new FormData();
            if (file) formData.append('file', file);
            formData.append('name', oldEntryName);
            formData.append('entryDate', oldEntryDate); // only include it once
            formData.append('notes', followUpEntry.notes);
            formData.append('date', followUpDate);
            formData.append('userID', localStorage.getItem('userId'));
            formData.append('entryID', oldEntryID);

            const response = await axiosInstance.post('/upload/follow-up', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            

            const newFollowUpEntry = response.data;
            handleAddFollowUpEntry(newFollowUpEntry, followUpDate);

            setFile(null);
            setPreviewSrc('');
            setIsPreviewAvailable(false);
            onClose();
            navigate('/calendar');
        } catch (error) {
            console.error('Error creating entry:', error);
            setErrorMsg('Error creating entry, please try again.');
        }
    };

    const onDrop = (files) => {
        const [uploadedFile] = files;
        setFile(uploadedFile);

        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewSrc(fileReader.result);
        };
        fileReader.readAsDataURL(uploadedFile);

        setIsPreviewAvailable(Boolean(uploadedFile.name.match(/\.(jpeg|jpg|png)$/)));
    };

    const handleEntrySubmit = async (e) => {
        e.preventDefault();
        await CreateFollowUpEntry();
    };

    const handleInputChange = (event) => {
        setFollowUpEntry({
            ...followUpEntry,
            [event.target.name]: event.target.value,
        });
    };

    const handleClearForm = () => {
        setFollowUpEntry(initialEntryState);
        setFile(null);
        setPreviewSrc('');
        setIsPreviewAvailable(false);
        setErrorMsg('');
        setFollowUpDate('');
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <CustomModal isOpen={isOpen} onClose={onClose} title="Follow-Up Entry">
            <h3>{name}</h3>
            <Form onSubmit={handleEntrySubmit} className={styles.followUpFormContainer} encType="multipart/form-data">
                {errorMsg && <p className="errorMsg">{errorMsg}</p>}
                <ImageUpload
                    onDrop={onDrop}
                    file={file}
                    previewSrc={previewSrc}
                    isPreviewAvailable={isPreviewAvailable}
                />
                <div>
                    <label htmlFor="followUpDate">Date</label>
                    <input
                        type="date"
                        id="followUpDate"
                        value={followUpDate}
                        onChange={(e) => setFollowUpDate(e.target.value)}
                    />
                </div>
                <div className='form-group margin-bottom'>
                    <textarea
                        type="text"
                        placeholder="Notes"
                        name="notes"
                        className="form-control width-100"
                        value={followUpEntry.notes}
                        onChange={handleInputChange}
                        style={{ height: '150px', verticalAlign: 'top' }}
                    />
                </div>
                <div className='margin-top flex-row'>
                    <Link type="button" onClick={handleCancel}>
                        Cancel
                    </Link>
                    <div className='flex-row-right'>
                        <button type="button" className="primary-button" onClick={handleClearForm}>
                            Clear Form
                        </button>
                        <button className="secondary-button" type="submit">
                            Submit
                        </button>
                    </div>
                </div>
            </Form>
        </CustomModal>
    );
};

export default NewFollowUpEntry;