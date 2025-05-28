import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CinemaHall from '../components/CinemaHall';
import { movies } from '../data/movies';
import '../styles/Booking.css';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  // Знаходимо фільм за ID
  const movie = movies.find(m => m.id === parseInt(id));
  
  if (!movie) {
    return (
      <div className="booking-error">
        <h2>Фільм не знайдено</h2>
        <button onClick={() => navigate('/')} className="back-button">
          Повернутися до списку фільмів
        </button>
      </div>
    );
  }
  
  const handleSeatsSelect = (seats) => {
    setSelectedSeats(seats);
  };
  
  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      alert('Будь ласка, оберіть хоча б одне місце');
      return;
    }
    
    // Тут можна додати логіку для збереження бронювання
    alert(`Успішно заброньовано ${selectedSeats.length} місць для фільму "${movie.title}"!`);
    navigate('/');
  };
  
  return (
    <div className="booking-page">
      <div className="booking-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Назад до списку
        </button>
        <div className="movie-info">
          <img src={movie.poster} alt={movie.title} className="movie-poster-small" />
          <div className="movie-details">
            <h1>{movie.title}</h1>
            <p className="movie-genre">{movie.genre}</p>
            <p className="movie-showtime">🕐 {movie.showtime}</p>
            <p className="movie-description">{movie.description}</p>
          </div>
        </div>
      </div>
      
      <div className="booking-content">
        <h2>Оберіть місця</h2>
        <CinemaHall 
          movieTitle={movie.title}
          onSeatsSelect={handleSeatsSelect}
        />
        
        {selectedSeats.length > 0 && (
          <div className="booking-actions">
            <button onClick={handleBooking} className="book-button">
              Забронювати {selectedSeats.length} місць за {selectedSeats.length * 150} грн
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;