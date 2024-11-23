import React, { useState } from 'react';
import './vehicle.css';

const VehicleCard = ({ vehicle }) => {
  const [zoomedImageUrl, setZoomedImageUrl] = useState(null);
  const [showRentForm, setShowRentForm] = useState(false); // State for rent form visibility
  const [showEditForm, setShowEditForm] = useState(false); // State for edit form visibility
  const [rentDetails, setRentDetails] = useState({
    renterName: '',
    startDate: '',
    endDate: ''
  });
  const [editMileage, setEditMileage] = useState(vehicle.mileage);
  const [showRentSuccess, setShowRentSuccess] = useState(false); // State for rent success message
  const [showRentError, setShowRentError] = useState(false); // State for rent error message
  const [showEditSuccess, setShowEditSuccess] = useState(false); // State for edit success message
  const [showEditError, setShowEditError] = useState(false); // State for edit error message
  const [loadingRent, setLoadingRent] = useState(false); // State for loading animation
  const loadingDuration = 1500; // Duration in milliseconds

  const openZoomedImage = (imageUrl) => {
    setZoomedImageUrl(imageUrl);
  };

  const closeZoomedImage = () => {
    setZoomedImageUrl(null);
  };

  const getHighlightColor = (value, type) => {
    let highlightColor = '';
    switch (type) {
      case 'mileage':
        const mileage = parseInt(value);
        if (mileage < 100000) {
          highlightColor = 'highlight-low-mileage';
        } else if (mileage >= 100000 && mileage < 200000) {
          highlightColor = 'highlight-medium-mileage';
        } else if (mileage >= 200000) {
          highlightColor = 'highlight-high-mileage';
        }
        break;
      case 'passengerCount':
        const passengerCount = parseInt(value);
        if (passengerCount <= 2) {
          highlightColor = 'highlight-2-passengers';
        } else if (passengerCount >= 3 && passengerCount < 5) {
          highlightColor = 'highlight-4-passengers';
        } else if (passengerCount >= 5) {
          highlightColor = 'highlight-5-passengers';
        }
        break;
      default:
        break;
    }
    return highlightColor;
  };

  const handleRentClick = () => {
    setShowRentForm(true);
  };

  const handleConfirmRent = async () => {
    setLoadingRent(true); // Display loading animation

    try {
      const response = await fetch('http://localhost:8080/api/rents/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          renterName: rentDetails.renterName,
          vehicle: vehicle,
          startDate: rentDetails.startDate,
          endDate: rentDetails.endDate,
        }),
      });

      if (response.ok) {
        // Hide loading animation after the specified duration
        setTimeout(() => {
          setLoadingRent(false);
          setShowRentSuccess(true);
          setShowRentForm(false); // Close the rent popup after successful rent
        }, loadingDuration);
      } else {
        const error = await response.text();
        throw new Error(error);
      }
    } catch (error) {
      console.error('Error renting vehicle:', error);
      setShowRentError(true);
    }

    setRentDetails({
      renterName: '',
      startDate: '',
      endDate: ''
    });
  };

  const handleCancelRent = () => {
    setShowRentForm(false);
  };

  const handleEditClick = () => {
    setShowEditForm(true);
    setShowRentForm(false); // Close rent form if open
  };

  const handleConfirmEdit = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/vehicles/${vehicle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...vehicle,
          mileage: editMileage
        }),
      });

      if (response.ok) {
        // If successful, update the local state
        setEditMileage(editMileage); // Update local state with new mileage
        setShowEditSuccess(true);
        setShowEditForm(false);
      } else {
        const errorText = await response.text();
        throw new Error(errorText);
      }
    } catch (error) {
      console.error('Error editing vehicle:', error);
      setShowEditError(true);
    }
  };

  const handleCancelEdit = () => {
    // Cancel editing, close the form
    setShowEditForm(false);
  };

  return (
    <div className="cards2">
      <div className="vehicle-card">
        <div className="card-content">
          <h2 name="vehiclename" id="vehiclename">
            {vehicle.name}({vehicle.year})
            <span className="label"></span>{' '}
            <span className="plate">{vehicle.plate}</span>
          </h2>

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

          <p>
            <span className="label">
              Mileage{' '}
              <span className={getHighlightColor(vehicle.mileage, 'mileage')}>
                {vehicle.mileage}
              </span>{' '}
            </span>{' '}
          </p>
          <p>
            <span className="label">
              Passenger Count{' '}
              <span className={getHighlightColor(vehicle.passengerCount, 'passengerCount')}>
                {vehicle.passengerCount}
              </span>
            </span>
          </p>
        </div>
        {zoomedImageUrl && (
          <div className="enlarged-image-modal" onClick={closeZoomedImage}>
            <div className="enlarged-image-container">
              <span className="close" onClick={closeZoomedImage}>
                &times;
              </span>
              <img src={zoomedImageUrl} alt="Enlarged Vehicle" />
            </div>
          </div>
        )}
      </div>
      <div className="buttons-container">
        <button className="edit-button" onClick={handleEditClick}>Edit</button>
        <button className="rent-button" onClick={handleRentClick}>
          Rent
        </button>
      </div>
      {showRentForm && (
        <div className="alert1-backdrop">
          <div className="alert1">
            <h2 id="renttitle">Rent {vehicle.name}({vehicle.year})</h2>
            <form>
              <div className="text-field1">
                <label htmlFor="renterName" id="rentername">
                  Renter Name:
                </label>
                <input
                  type="text"
                  id="renterName"
                  value={rentDetails.renterName}
                  onChange={(e) =>
                    setRentDetails({ ...rentDetails, renterName: e.target.value })
                  }
                  autoComplete="off"
                />
              </div>
              <div className="text-field1">
                <label htmlFor="startDate">Start Date:</label>
                <input
                  type="date"
                  id="startDate"
                  value={rentDetails.startDate}
                  onChange={(e) =>
                    setRentDetails({ ...rentDetails, startDate: e.target.value })
                  }
                />
              </div>
              <div className="text-field1">
                <label htmlFor="endDate">End Date:</label>
                <input
                  type="date"
                  id="endDate"
                  value={rentDetails.endDate}
                  onChange={(e) =>
                    setRentDetails({ ...rentDetails, endDate: e.target.value })
                  }
                  autoComplete="off"
                />
              </div>
              <div className="popup-buttons">
                <button type="button" onClick={handleConfirmRent}>
                  Rent
                </button>
                <button type="button" onClick={handleCancelRent}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditForm && (
        <div className="alert1-backdrop">
          <div className="alert1">
            <h2 id="renttitle">Edit Mileage for {vehicle.name} ({vehicle.year})</h2>
            <form>
              <div className="text-field1">
                <label htmlFor="newMileage">New Mileage:</label>
                <input
                  type="number"
                  id="newMileage"
                  value={editMileage}
                  onChange={(e) => setEditMileage(e.target.value)}
                />
              </div>
              <div className="popup-buttons">
                <button type="button" onClick={handleConfirmEdit}>
                  Confirm
                </button>
                <button type="button" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditSuccess && (
        <div className="alert-backdrop success-alert-backdrop">
          <div className="alert success-alert">
            <p>Edit successful!</p>
            <button onClick={() => setShowEditSuccess(false)}>OK</button>
          </div>
        </div>
      )}
      {showEditError && (
        <div className="alert-backdrop error-alert-backdrop">
          <div className="alert error-alert">
            <p>Error editing vehicle. Please try again later.</p>
            <button onClick={() => setShowEditError(false)}>OK</button>
          </div>
        </div>
      )}
      {showRentSuccess && (
        <div className="alert-backdrop success-alert-backdrop">
          <div className="alert success-alert">
            <p>Rent successful!</p>
            <button onClick={() => setShowRentSuccess(false)}>OK</button>
          </div>
        </div>
      )}
      {showRentError && (
        <div className="alert-backdrop error-alert-backdrop">
          <div className="alert error-alert">
            <p>Error renting vehicle. Please try again later.</p>
            <button onClick={() => setShowRentError(false)}>OK</button>
          </div>
        </div>
      )}
      {loadingRent && ( // Loading animation when renting
        <div className="loading-overlay">
          <div className="loading-dots">
            <div className="dot-1"></div>
            <div className="dot-2"></div>
            <div className="dot-3"></div>
            <div className="dot-4"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleCard;
