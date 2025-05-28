import React, { useState } from 'react';
import '../styles/CinemaHall.css';

const CinemaHall = ({ movieTitle, onSeatsSelect }) => {
  // Створюємо сітку місць 8x10 (8 рядів по 10 місць)
  const rows = 8;
  const seatsPerRow = 10;
  
  // Генеруємо випадкові заброньовані місця
  const generateBookedSeats = () => {
    const booked = new Set();
    const numberOfBookedSeats = Math.floor(Math.random() * 20) + 10; // 10-30 заброньованих місць
    
    while (booked.size < numberOfBookedSeats) {
      const row = Math.floor(Math.random() * rows);
      const seat = Math.floor(Math.random() * seatsPerRow);
      booked.add(`${row}-${seat}`);
    }
    
    return booked;
  };

  const [bookedSeats] = useState(generateBookedSeats());
  const [selectedSeats, setSelectedSeats] = useState(new Set());

  const handleSeatClick = (row, seat) => {
    const seatId = `${row}-${seat}`;
    
    // Не можна вибрати заброньоване місце
    if (bookedSeats.has(seatId)) return;
    
    const newSelectedSeats = new Set(selectedSeats);
    
    if (newSelectedSeats.has(seatId)) {
      newSelectedSeats.delete(seatId);
    } else {
      newSelectedSeats.add(seatId);
    }
    
    setSelectedSeats(newSelectedSeats);
    
    // Передаємо вибрані місця батьківському компоненту
    if (onSeatsSelect) {
      onSeatsSelect(Array.from(newSelectedSeats));
    }
  };

  const getSeatClass = (row, seat) => {
    const seatId = `${row}-${seat}`;
    
    if (bookedSeats.has(seatId)) return 'seat booked';
    if (selectedSeats.has(seatId)) return 'seat selected';
    return 'seat available';
  };

  const getSeatLabel = (row, seat) => {
    const rowLetter = String.fromCharCode(65 + row); // A, B, C, D...
    return `${rowLetter}${seat + 1}`;
  };

  return (
    <div className="cinema-hall">
      <div className="screen">
        <div className="screen-text">ЕКРАН</div>
      </div>
      
      <div className="seats-container">
        {Array.from({ length: rows }, (_, row) => (
          <div key={row} className="seat-row">
            <div className="row-label">{String.fromCharCode(65 + row)}</div>
            <div className="seats">
              {Array.from({ length: seatsPerRow }, (_, seat) => (
                <button
                  key={`${row}-${seat}`}
                  className={getSeatClass(row, seat)}
                  onClick={() => handleSeatClick(row, seat)}
                  disabled={bookedSeats.has(`${row}-${seat}`)}
                  title={getSeatLabel(row, seat)}
                >
                  {seat + 1}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="legend">
        <div className="legend-item">
          <div className="seat available"></div>
          <span>Доступно</span>
        </div>
        <div className="legend-item">
          <div className="seat selected"></div>
          <span>Вибрано</span>
        </div>
        <div className="legend-item">
          <div className="seat booked"></div>
          <span>Заброньовано</span>
        </div>
      </div>
      
      {selectedSeats.size > 0 && (
        <div className="selected-seats-info">
          <h3>Вибрані місця:</h3>
          <div className="selected-seats-list">
            {Array.from(selectedSeats).map(seatId => {
              const [row, seat] = seatId.split('-').map(Number);
              return (
                <span key={seatId} className="selected-seat-badge">
                  {getSeatLabel(row, seat)}
                </span>
              );
            })}
          </div>
          <p className="total-price">
            Всього: {selectedSeats.size} × 150 грн = {selectedSeats.size * 150} грн
          </p>
        </div>
      )}
    </div>
  );
};

export default CinemaHall;