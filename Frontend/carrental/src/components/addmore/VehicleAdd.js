import React, { useState, useRef, useEffect } from 'react';
import './vehicleadd.css';

const VehicleAdd = () => {
  const [name, setName] = useState('');
  const [plate, setPlate] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [passengerCount, setPassengerCount] = useState('');
  const [vehicleType, setVehicleType] = useState('car'); // Default value set to 'car'
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showImageLimitAlert, setShowImageLimitAlert] = useState(false);
  const [existingPlateAlert, setExistingPlateAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false); // State for loading animation
  const [showYearSymbolAlert, setShowYearSymbolAlert] = useState(false); // State for year alert
  const [showMileageSymbolAlert, setShowMileageSymbolAlert] = useState(false); // State for mileage alert
  const fileInputRef = useRef(null);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);

    // Fetch suggestions only if there's a value
    if (value) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const fetchSuggestions = async (partialName) => {
    try {
      const response = await fetch(`http://localhost:8080/api/vehicles/suggestions?partialName=${partialName}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePlateChange = (e) => {
    setPlate(e.target.value);
    setExistingPlateAlert(false);
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    if (/^\d+$/.test(value) || value === '') {
      setYear(value);
      setShowYearSymbolAlert(false);
    } else {
      setShowYearSymbolAlert(true);
    }
  };

  const handleMileageChange = (e) => {
    const value = e.target.value;
    if (/^\d+$/.test(value) || value === '') {
      setMileage(value);
      setShowMileageSymbolAlert(false);
    } else {
      setShowMileageSymbolAlert(true);
    }
  };

  const handlePassengerCountChange = (e) => {
    setPassengerCount(e.target.value);
  };

  const handleVehicleTypeChange = (e) => {
    setVehicleType(e.target.value);
    // Automatically update plate label based on vehicle type
    switch (e.target.value) {
      case 'car':
        setPlateLabel('Plate Number of the Car:');
        break;
      case 'van':
        setPlateLabel('Plate Number of the Van:');
        break;
      case 'lorry':
        setPlateLabel('Plate Number of the Lorry:');
        break;
      default:
        setPlateLabel('Plate Number:');
        break;
    }
  };

  const setPlateLabel = (label) => {
    const plateLabel = document.getElementById('plate-label');
    if (plateLabel) {
      plateLabel.textContent = label;
    }
  };

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    if (selectedImages.length > 4) {
      setShowImageLimitAlert(true);
      e.target.value = null;
      return;
    }

    const previews = selectedImages.map(image => URL.createObjectURL(image));
    setImagePreviews(previews);

    setImages(selectedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Display loading animation
  
    if (!name || !plate || !year || !mileage || !passengerCount || images.length === 0 || !(/^\d+$/.test(year) || year === '') || !(/^\d+$/.test(mileage) || mileage === '')) {
      showAlertWithLoading(() => setShowAlert(true));
      return;
    }
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('plate', plate);
    formData.append('year', year);
    formData.append('mileage', mileage);
    formData.append('passengerCount', passengerCount);
    formData.append('vehicleType', vehicleType); // Append vehicleType to form data
    formData.append('rentStatus', false); // Append rentStatus as boolean
    images.forEach(image => {
      formData.append('files', image);
    });
  
    try {
      const response = await fetch("http://localhost:8080/api/vehicles/add", {
        method: "POST",
        body: formData
      });
  
      if (response.status === 409) {
        showAlertWithLoading(() => setExistingPlateAlert(true));
        return;
      }
  
      if (response.ok) {
        const data = await response.json();
        console.log("New Vehicle Added:", data);
        setName('');
        setPlate('');
        setYear('');
        setMileage('');
        setPassengerCount('');
        setImages([]);
        setImagePreviews([]);
        setShowSuccessAlert(true);
        setLoading(false); // Hide loading animation
        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }
      } else {
        console.error('Error:', response.statusText);
        setLoading(false); // Hide loading animation
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false); // Hide loading animation
    }
  };
  

  const showAlertWithLoading = (showAlertFunction) => {
    setLoading(true); // Display loading animation
    setTimeout(() => {
      showAlertFunction();
      setLoading(false); // Hide loading animation after 1.5 seconds
    }, 1000);
  };

  const openEnlargedImage = (url) => {
    setEnlargedImage(url);
  };

  const closeEnlargedImage = () => {
    setEnlargedImage(null);
  };

  const handleClearImages = () => {
    setImages([]);
    setImagePreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setName(suggestion);
    setSuggestions([]);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.suggestions')) {
        setSuggestions([]);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <div>
      {/* Loading animation */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-dots">
            <div className="dot-1"></div>
            <div className="dot-2"></div>
            <div className="dot-3"></div>
            <div className="dot-4"></div>
          </div>
        </div>
      )}
          <div id="pk"><h2 id="title3">Add Vehicle</h2></div>
      <div className='form-container'>
        <form onSubmit={handleSubmit}>

          <div className="text-field">
            <label htmlFor="name">Name of the Vehicle:</label>
            <input type="text" id="name" value={name} onChange={handleNameChange} autoComplete="off"  />
            <ul className="suggestions">
              {suggestions.map((suggestion, index) => (
                <li key={index} onClick={() => handleSuggestionClick(suggestion)}>{suggestion}</li>
              ))}
            </ul>
          </div>
          <div className="text-field">
            <label htmlFor="vehicleType" name="type1">Vehicle Type:</label>
            <select id="vehicleType" value={vehicleType} onChange={handleVehicleTypeChange}>
              <option value="car">Car</option>
              <option value="van">Van</option>
              <option value="lorry">Lorry</option>
            </select>
          </div>
          <div className="text-field">
            <label id="plate-label" htmlFor="plate">Plate Number of the Car:</label>
            <input type="text" id="plate" value={plate} onChange={handlePlateChange} autoComplete="off" />
          </div>
          <div className="text-field">
            <label htmlFor="year">Year of the Vehicle:</label>
            <input type="text" id="year" value={year} onChange={handleYearChange} autoComplete="off" />
            {showYearSymbolAlert && (
              <p className="alert-message">Please enter only numbers for the year.</p>
            )}
          </div>
          <div className="text-field">
            <label htmlFor="mileage">Mileage:</label>
            <input type="text" id="mileage" value={mileage} onChange={handleMileageChange} autoComplete="off"/>
            {showMileageSymbolAlert && (
              <p className="alert-message">Please enter only numbers for the mileage.</p>
            )}
          </div>
          <div className="text-field">
            <label htmlFor="passengerCount">Passenger Count:</label>
            <input type="text" id="passengerCount" value={passengerCount} onChange={handlePassengerCountChange} autoComplete="off" />
          </div>
          <div className="text-field">
            <button type="button" className="choose-files-button" onClick={() => fileInputRef.current.click()}>
              Choose Images (max of 4)
            </button>
            {images.length > 0 && (
              <button type="button" className="clear-files-button" onClick={handleClearImages}>Clear Images</button>
            )}
            <input type="file" id="images" name="images" ref={fileInputRef} multiple onChange={handleImageChange} style={{ display: 'none' }} />
          </div>
          <div className="image-previews">
            {imagePreviews.map((preview, index) => (
              <img key={index} src={preview} alt={`Preview ${index + 1}`} onClick={() => openEnlargedImage(preview)} />
            ))}
          </div>
          <button type="submit">Add Vehicle</button>
        </form>
        {showAlert && (
          <div className="alert-backdrop">
            <div className="alert">
              <p>Please fill in all fields and select at least one image.</p>
              <button onClick={() => setShowAlert(false)}>OK</button>
            </div>
          </div>
        )}
        {showImageLimitAlert && (
          <div className="alert-backdrop">
            <div className="alert">
              <p>You can only upload up to 4 images.</p>
              <button onClick={() => setShowImageLimitAlert(false)}>OK</button>
            </div>
          </div>
        )}
        {existingPlateAlert && (
          <div className="alert-backdrop">
            <div className="alert">
              <p>Vehicle with this plate number already exists.</p>
              <button onClick={() => setExistingPlateAlert(false)}>OK</button>
            </div>
          </div>
        )}
        {showSuccessAlert && (
          <div className="alert-backdrop">
            <div className="alert">
              <p>Vehicle added successfully.</p>
              <button onClick={() => setShowSuccessAlert(false)}>OK</button>
            </div>
          </div>
        )}
      </div>
      {enlargedImage && (
        <div className="lightbox-backdrop" onClick={closeEnlargedImage}>
          <div className="lightbox">
            <img src={enlargedImage} alt="Enlarged" />
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleAdd;
