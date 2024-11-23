import React, { useState, useEffect } from 'react';
import RentedCard from './RentedCard';
import './rented.css';

const Rented = () => {
  const [rentedVehicles, setRentedVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [checkedVehicles, setCheckedVehicles] = useState({
    car: false,
    van: false,
    lorry: false
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(9);

  useEffect(() => {
    const fetchRentedVehicles = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/rents/rented");
        if (response.ok) {
          const data = await response.json();
          setRentedVehicles(data);
        } else {
          console.error('Error fetching rented vehicles:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching rented vehicles:', error);
      }
    };

    fetchRentedVehicles();
  }, []);

  const handleRemoveFromRent = async (vehicleId) => {
    try {
      // Make a PUT request to update the rent status of the vehicle
      const vehicleResponse = await fetch(`http://localhost:8080/api/vehicles/${vehicleId}/updateRentStatus`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rentStatus: false }),
      });
      
      // If updating the rent status is successful
      if (vehicleResponse.ok) {
        // Filter out the removed vehicle from rentedVehicles
        setRentedVehicles(prevRentals => prevRentals.filter(rentedVehicle => rentedVehicle.vehicle.id !== vehicleId));
        
        // Make a DELETE request to remove the rent entry
        const rentResponse = await fetch(`http://localhost:8080/api/rents/remove/${vehicleId}`, {
          method: 'DELETE',
        });
        
        // If removing the rent entry is not successful, log the error
        if (!rentResponse.ok) {
          console.error('Error removing rent entry:', rentResponse.statusText);
        }
      } else {
        console.error('Error updating rent status:', vehicleResponse.statusText);
      }
    } catch (error) {
      console.error('Error updating rent status:', error);
    }
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckedVehicles(prevState => ({
      ...prevState,
      [name]: checked
    }));
  };

  const filteredVehicles = rentedVehicles.filter(rentedVehicle => {
    if (!checkedVehicles.car && !checkedVehicles.van && !checkedVehicles.lorry) {
      return true; // No filter applied, so all vehicles pass
    }

    if ((checkedVehicles.car && rentedVehicle.vehicle.vehicleType === 'car') ||
        (checkedVehicles.van && rentedVehicle.vehicle.vehicleType === 'van') ||
        (checkedVehicles.lorry && rentedVehicle.vehicle.vehicleType === 'lorry')) {
      return true;
    }

    return false;
  }).filter(rentedVehicle => {
    return rentedVehicle.vehicle.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredVehicles.slice(indexOfFirstCard, indexOfLastCard);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div>
      <div id="pk"><h2 name="title4" id="title4">Rented Vehicles</h2></div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleInputChange}
        />
        <div className="checkbox-container">
          <span className="checkmark-label1">
            <p id="vehic">Car</p>
            <input
              className="checkmark-input"
              type="checkbox"
              name="car"
              checked={checkedVehicles.car}
              onChange={handleCheckboxChange}
            />
            <span className="checkmark-mark"></span>
          </span>
          <span className="checkmark-label2">
            <p id="vehic">Van</p>
            <input
              className="checkmark-input"
              type="checkbox"
              name="van"
              checked={checkedVehicles.van}
              onChange={handleCheckboxChange}
            />
            <span className="checkmark-mark"></span>
          </span>
          <span className="checkmark-label3">
            <p id="vehic">Lorry</p>
            <input
              className="checkmark-input"
              type="checkbox"
              name="lorry"
              checked={checkedVehicles.lorry}
              onChange={handleCheckboxChange}
            />
            <span className="checkmark-mark"></span>
          </span>
        </div>
      </div>
      {filteredVehicles.length === 0 ? (
        <p className="no-vehicles">No vehicles found.</p>
      ) : (
        <div className="vehicle-container">
          {currentCards.map(rentedVehicle => (
            <RentedCard
              key={rentedVehicle.id}
              vehicle={rentedVehicle.vehicle}
              renterName={rentedVehicle.renterName}
              startDate={rentedVehicle.startDate}
              endDate={rentedVehicle.endDate}
              onRemoveRent={() => handleRemoveFromRent(rentedVehicle.vehicle.id)}
            />
          ))}
        </div>
      )}
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredVehicles.length / cardsPerPage) }, (_, i) => (
          <button key={i} onClick={() => paginate(i + 1)}>{i + 1}</button>
        ))}
      </div>
    </div>
  );
};

export default Rented;
