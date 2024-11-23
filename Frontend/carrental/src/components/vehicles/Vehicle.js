import React, { useState, useEffect } from 'react';
import VehicleCard from './VehicleCard';
import './vehicle.css';

const Vehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [checkedVehicles, setCheckedVehicles] = useState({
    car: false,
    van: false,
    lorry: false
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(9);

  useEffect(() => {
    const fetchNonRentedVehicles = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/vehicles/not-rented");
        if (response.ok) {
          const data = await response.json();
          setVehicles(data);
        } else {
          throw new Error('Failed to fetch vehicles');
        }
      } catch (error) {
        console.error('Error fetching non-rented vehicles:', error);
      }
    };

    fetchNonRentedVehicles();
  }, []); // Run only once on component mount

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

  const filteredVehicles = vehicles.filter(vehicle => {
    if (!checkedVehicles.car && !checkedVehicles.van && !checkedVehicles.lorry) {
      return true; // No filter applied, so all vehicles pass
    }

    if ((checkedVehicles.car && vehicle.vehicleType === 'car') ||
        (checkedVehicles.van && vehicle.vehicleType === 'van') ||
        (checkedVehicles.lorry && vehicle.vehicleType === 'lorry')) {
      return true;
    }

    return false;
  }).filter(vehicle => {
    return vehicle.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Logic for pagination
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredVehicles.slice(indexOfFirstCard, indexOfLastCard);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="container"> {/* Add the container class */}
      <div id="pk">
        <h2 name="title5" id="title5">Vehicles For Hire</h2>
      </div>
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

      {currentCards.length === 0 && <p className="no-vehicles">No vehicles found.</p>}

      <div className="vehicle-container2">
        {currentCards.map(vehicle => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredVehicles.length / cardsPerPage) }, (_, i) => (
          <button key={i} onClick={() => paginate(i + 1)}>{i + 1}</button>
        ))}
      </div>
    </div>
  );
};

export default Vehicle;
