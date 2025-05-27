// src/components/MovieCard.jsx
import React from 'react';
import '../styles/MovieCard.css';

const MovieCard = ({ movie }) => {
  const formatShowTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('uk-UA'),
      time: date.toLocaleTimeString('uk-UA', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const { date, time } = formatShowTime(movie.showTime);

  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img 
          src={movie.poster} 
          alt={movie.title}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x450/cccccc/666666?text=No+Image';
          }}
        />
        <div className="movie-rating">
          <span>⭐ {movie.rating}</span>
        </div>
      </div>
      
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-genre">{movie.genre}</p>
        <p className="movie-description">{movie.description}</p>
        
        <div className="movie-details">
          <div className="movie-duration">
            <span>🕐 {movie.duration}</span>
          </div>
          <div className="movie-showtime">
            <div className="show-date">📅 {date}</div>
            <div className="show-time">🕒 {time}</div>
          </div>
        </div>
        
        <button className="book-ticket-btn">
          Забронювати квиток
        </button>
      </div>
    </div>
  );
};

export default MovieCard;