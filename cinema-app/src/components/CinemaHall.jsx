import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BookingService from '../services/BookingService';
import '../styles/Booking.css';

const CinemaHall = ({ onSeatSelect }) => {
  const { id } = useParams();
  const rows = 8; // A to H
  const seatsPerRow = 10;
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState(new Set());

  useEffect(() => {
    const generateSeats = () => {
      const seatLayout = [];
      for (let row = 0; row < rows; row++) {
        const rowLetter = String.fromCharCode(65 + row); // A, B, C, ..., H
        for (let number = 1; number <= seatsPerRow; number++) {
          const seatId = `${rowLetter}${number}`;
          const isBooked = BookingService.isSeatBooked(id, seatId);
          seatLayout.push({
            id: seatId,
            row: rowLetter,
            number,
            status: isBooked ? 'booked' : 'available'
          });
        }
      }
      setSeats(seatLayout);
    };
    generateSeats();
  }, [id]);

  const handleSeatClick = (seat) => {
    if (seat.status === 'booked') return;

    const newSelectedSeats = new Set(selectedSeats);
    if (newSelectedSeats.has(seat.id)) {
      newSelectedSeats.delete(seat.id);
    } else {
      newSelectedSeats.add(seat.id);
    }
    setSelectedSeats(newSelectedSeats);
    onSeatSelect(seats.filter(s => newSelectedSeats.has(s.id)));
  };

  const getSeatClass = (seat) => {
    if (!seat) return 'seat available';
    if (seat.status === 'booked') return 'seat booked';
    if (selectedSeats.has(seat.id)) return 'seat selected';
    return 'seat available';
  };

  if (seats.length === 0) {
    return <div>Завантаження...</div>;
  }

  return (
    <div className="cinema-hall">
      <div className="screen">
        <div className="screen-label">ЕКРАН</div>
      </div>
      
      <div className="seats-grid">
        {Array.from({ length: rows }, (_, row) => {
          const rowLetter = String.fromCharCode(65 + row);
          return (
            <div key={rowLetter} className="seat-row">
              <div className="row-label">{rowLetter}</div>
              <div className="seats-in-row">
                {Array.from({ length: seatsPerRow }, (_, seat) => {
                  const seatData = seats.find(s => s.id === `${rowLetter}${seat + 1}`);
                  return (
                    <button
                      key={`${rowLetter}${seat + 1}`}
                      className={getSeatClass(seatData)}
                      onClick={() => seatData && handleSeatClick(seatData)}
                      disabled={seatData?.status === 'booked'}
                      title={seatData ? `Місце ${seatData.id} - ${seatData.status === 'booked' ? 'Заброньовано' : 'Вільно'}` : ''}
                    >
                      {seat + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="legend">
        <div className="legend-item">
          <div className="seat available legend-seat"></div>
          <span>Вільні</span>
        </div>
        <div className="legend-item">
          <div className="seat selected legend-seat"></div>
          <span>Обрані</span>
        </div>
        <div className="legend-item">
          <div className="seat booked legend-seat"></div>
          <span>Заброньовані</span>
        </div>
      </div>
    </div>
  );
};

export default CinemaHall;