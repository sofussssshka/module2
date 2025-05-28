// src/components/BookingForm.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingService from '../services/BookingService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingForm = ({ selectedSeats = [], movieTitle = '', moviePrice = 0, onConfirm, onBack }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    showtime: '20:00'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Ім'я обов'язкове";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email обов'язковий";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Невірний формат email";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Телефон обов'язковий";
    } else if (!/^[+]?[(]?[\d\s\-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Невірний формат телефону";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Будь ласка, виправте помилки у формі", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        ...formData,
        seats: selectedSeats.map(s => s.id),
        totalPrice: selectedSeats.length * moviePrice
      };

      // Показуємо сповіщення про початок процесу
      const loadingToast = toast.loading("Обробка бронювання...", {
        position: "top-right",
      });

      // Симулюємо асинхронну операцію збереження
      await new Promise(resolve => setTimeout(resolve, 1500));

      const result = BookingService.saveBooking(id, bookingData.seats, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        showtime: formData.showtime,
        totalPrice: bookingData.totalPrice
      });

      // Закриваємо loading toast
      toast.dismiss(loadingToast);

      if (result.success) {
        // Успішне бронювання
        toast.success(
          <div>
            <strong>Дякуємо за бронювання, {formData.name}!</strong>
            <br />
            <small>Місця: {selectedSeats.map(s => s.id).join(', ')}</small>
            <br />
            <small>Сума: {bookingData.totalPrice} грн</small>
          </div>, 
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );

        // Відправляємо email підтвердження (симуляція)
        setTimeout(() => {
          toast.info(`📧 Підтвердження надіслано на ${formData.email}`, {
            position: "bottom-right",
            autoClose: 4000,
          });
        }, 1000);

        if (onConfirm) {
          onConfirm(bookingData);
        }

        // Перенаправлення через 2 секунди
        setTimeout(() => {
          navigate('/');
        }, 2000);

      } else {
        throw new Error(result.error || 'Помилка при бронюванні');
      }

    } catch (error) {
      console.error('Booking error:', error);
      toast.error(
        <div>
          <strong>Помилка бронювання!</strong>
          <br />
          <small>{error.message || 'Спробуйте ще раз'}</small>
        </div>,
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = selectedSeats.length * moviePrice;

  return (
    <div className="booking-form-overlay">
      <div className="booking-form-modal">
        <div className="booking-form-header">
          <h2>Бронювання квитків для {movieTitle}</h2>
          <button onClick={onBack} className="close-btn">×</button>
        </div>

        <div className="selected-seats-info">
          <h3>Вибрані місця:</h3>
          <div className="seats-list">
            {selectedSeats.map(seat => (
              <span key={seat.id} className="selected-seat-badge">
                {seat.id}
              </span>
            ))}
          </div>
          <p>Ціна за квиток: {moviePrice} грн</p>
          <p>Загальна сума: {totalPrice} грн</p>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label>Повне ім'я *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? 'error' : ''}
              placeholder="Введіть ваше повне ім'я"
              disabled={isSubmitting}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
              placeholder="example@email.com"
              disabled={isSubmitting}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Телефон *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={errors.phone ? 'error' : ''}
              placeholder="+380XXXXXXXXX"
              disabled={isSubmitting}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label>Час сеансу</label>
            <select 
              name="showtime" 
              value={formData.showtime} 
              onChange={handleInputChange}
              disabled={isSubmitting}
            >
              <option value="14:00">14:00</option>
              <option value="17:00">17:00</option>
              <option value="20:00">20:00</option>
              <option value="22:30">22:30</option>
            </select>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={onBack}
              disabled={isSubmitting}
            >
              Скасувати
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Обробка...' : `Підтвердити (${totalPrice} грн)`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;