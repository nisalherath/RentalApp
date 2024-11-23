import React, { useState } from 'react';
import Modal from 'react-modal';
//import './rented.css';

Modal.setAppElement('#root'); // Set the root element for accessibility

const RentedCard = ({ vehicle, renterName, startDate, endDate, onRemoveRent }) => {
  const [zoomedImageUrl, setZoomedImageUrl] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false); // State for confirmation alert
  const [showForm, setShowForm] = useState(false); // State for extending rent form
  const [extendedStartDate, setExtendedStartDate] = useState(startDate); // State for extended start date
  const [extendedEndDate, setExtendedEndDate] = useState(endDate); // State for extended end date
  const [showSuccessAlert, setShowSuccessAlert] = useState(false); // State for success alert
  const [showErrorAlert, setShowErrorAlert] = useState(false); // State for error alert

  const openZoomedImage = (imageUrl) => {
    setZoomedImageUrl(imageUrl);
  };

  const closeZoomedImage = () => {
    setZoomedImageUrl(null);
  };

  const handleRemoveRent = () => {
    setShowConfirmation(true); // Show confirmation alert
  };

  const handleExtendRent = () => {
    setShowForm(true); // Show extend rent form
  };

  const confirmRemoveRent = () => {
    setShowConfirmation(false); // Close confirmation alert
    onRemoveRent(); // Call the onRemoveRent callback
  };

  const cancelRemoveRent = () => {
    setShowConfirmation(false); // Close confirmation alert
  };

  const handleConfirmExtendRent = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/rents/update/${vehicle.id}`, { // Use the correct URL with vehicle ID
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: extendedStartDate,
          endDate: extendedEndDate,
        }),
      });
      if (response.ok) {
        setShowForm(false); // Close extend rent form after confirming
        setShowSuccessAlert(true); // Show success alert
      } else {
        setShowErrorAlert(true); // Show error alert for unsuccessful update
      }
    } catch (error) {
      console.error('Error extending rent:', error);
      setShowErrorAlert(true); // Show error alert for failed request
    }
  };

  const handleCancelExtendRent = () => {
    setShowForm(false); // Close extend rent form
  };

  return (
    <div className="cards">
      <div className="vehicle-card">
        <div className="card-content">
          <h2 id="vehiclename">{vehicle.name} ({vehicle.year}) <span className="plate">{vehicle.plate}</span></h2>
          
          <div className="image-container">
            {vehicle.imageUrls.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`Vehicle ${index + 1}`}
                onClick={() => openZoomedImage(imageUrl)}
              />
            ))}
          </div>
          <p><span className="label">Renter Name <span className="highlight">{renterName}</span></span></p> {/* Display renterName */}
          <p><span className="label">Start Date <span className="highlight">{startDate}</span></span></p> {/* Display startDate */}
          <p><span className="label">End Date <span className="highlight">{endDate}</span></span></p> {/* Display endDate */}
        </div>
        {zoomedImageUrl && (
          <div className="enlarged-image-modal" onClick={closeZoomedImage}>
            <div className="enlarged-image-container">
              <span className="close" onClick={closeZoomedImage}>&times;</span>
              <img src={zoomedImageUrl} alt="Enlarged Vehicle" />
            </div>
          </div>
        )}
      </div>
      <div className="buttons-container">
        <button className="remove-rent-button" onClick={handleRemoveRent}>Remove Rent</button> {/* Use handleRemoveRent */}
        <button className="extend-rent-button" onClick={handleExtendRent}>Extend Rent</button> {/* Button to extend rent duration */}
      </div>
      {showConfirmation && (
        <div className="alert-backdrop success-alert-backdrop">
          <div className="alert success-alert">
            <p>Are you sure you want to remove the rent?</p>
            <button onClick={confirmRemoveRent}>Confirm</button>
            <button onClick={cancelRemoveRent}>Cancel</button>
          </div>
        </div>
      )}
      {showForm && (
        <div className="alert1-backdrop">
          <div className="alert1">
            <h2 id="renttitle">Extend Rent for {vehicle.name} ({vehicle.year})</h2>
            <form>
              <div className="text-field1">
                <label htmlFor="extendedStartDate">Start Date:</label>
                <input type="date" id="extendedStartDate" value={extendedStartDate} onChange={(e) => setExtendedStartDate(e.target.value)} />
              </div>
              <div className="text-field1">
                <label htmlFor="extendedEndDate">End Date:</label>
                <input type="date" id="extendedEndDate" value={extendedEndDate} onChange={(e) => setExtendedEndDate(e.target.value)} />
              </div>
              <div className="popup-buttons">
                <button type="button" onClick={handleConfirmExtendRent}>Confirm</button>
                <button type="button" onClick={handleCancelExtendRent}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showSuccessAlert && (
        <div className="alert-backdrop success-alert-backdrop">
          <div className="alert success-alert">
            <p>Rent extension successful!</p>
            <button onClick={() => setShowSuccessAlert(false)}>OK</button>
          </div>
        </div>
      )}
      {showErrorAlert && (
        <div className="alert-backdrop error-alert-backdrop">
          <div className="alert error-alert">
            <p>Error extending rent. Please try again later.</p>
            <button onClick={() => setShowErrorAlert(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentedCard;
