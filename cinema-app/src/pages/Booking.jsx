// src/pages/Booking.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CinemaHall from '../components/CinemaHall';
import BookingForm from '../components/BookingForm';
import { movies } from '../data/movies';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Booking.css';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = movies.find(m => m.id === Number(id));
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    setSelectedSeats([]);
    setIsFormVisible(false);
  }, [id]);

  if (!movie) {
    return <div>Фільм не знайдено</div>;
  }

  const handleSeatSelect = (seats) => {
    setSelectedSeats(seats);
  };

  const handleProceedToForm = () => {
    if (selectedSeats.length === 0) {
      alert('Будь ласка, оберіть хоча б одне місце');
      return;
    }
    setIsFormVisible(true);
  };

  const handleBackToSeats = () => {
    setIsFormVisible(false);
  };

  const moviePrice = 150;
  const totalPrice = selectedSeats.length * moviePrice;

  return (
    <div>
      <h1>Бронювання: {movie.title}</h1>
      <div className="movie-poster">
        <img src={movie.poster} alt={movie.title} />
      </div>
      <CinemaHall onSeatSelect={handleSeatSelect} />
      
      {selectedSeats.length > 0 && !isFormVisible && (
        <div className="booking-controls">
          <div className="selected-info">
            <h3>Вибрані місця:</h3>
            <p className="selected-seats-list">
              {selectedSeats.map(seat => seat.id).join(', ')}
            </p>
            <p>Загальна сума: {totalPrice} грн</p>
          </div>
          <button
            className="book-button"
            onClick={handleProceedToForm}
          >
            Забронювати
          </button>
        </div>
      )}

      {!isFormVisible && (
        <button onClick={() => navigate('/')} className="back-to-list-btn">
          Назад до фільмів
        </button>
      )}

      {isFormVisible && (
        <BookingForm
          selectedSeats={selectedSeats}
          movieTitle={movie.title}
          moviePrice={moviePrice}
          onBack={handleBackToSeats}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default Booking;