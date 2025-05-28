// src/services/BookingService.js
const BOOKING_KEY = "movieBookings";

const BookingService = {
  // Отримати всі бронювання для конкретного фільму
  getBookings: (movieId) => {
    try {
      const bookings = JSON.parse(localStorage.getItem(BOOKING_KEY) || "{}");
      return bookings[movieId] || [];
    } catch (error) {
      console.error("Помилка при отриманні бронювань:", error);
      return [];
    }
  },

  // Зберегти нове бронювання
  saveBooking: (movieId, seats, userData) => {
    try {
      const bookings = JSON.parse(localStorage.getItem(BOOKING_KEY) || "{}");

      // Ініціалізуємо масив для фільму якщо його ще немає
      if (!bookings[movieId]) {
        bookings[movieId] = [];
      }

      // Перевіряємо, чи не заброньовані вже місця
      const existingSeats = BookingService.getBookedSeats(movieId);
      const conflictSeats = seats.filter((seat) =>
        existingSeats.includes(seat)
      );

      if (conflictSeats.length > 0) {
        throw new Error(`Місця ${conflictSeats.join(", ")} вже заброньовані`);
      }

      // Додаємо нове бронювання
      const newBooking = {
        id: Date.now().toString(), // Унікальний ID бронювання
        seats: [...seats],
        userData: { ...userData },
        timestamp: new Date().toISOString(),
        status: "confirmed",
      };

      bookings[movieId].push(newBooking);
      localStorage.setItem(BOOKING_KEY, JSON.stringify(bookings));

      return newBooking;
    } catch (error) {
      console.error("Помилка при збереженні бронювання:", error);
      throw error;
    }
  },

  // Перевірити, чи заброньоване конкретне місце
  isSeatBooked: (movieId, seat) => {
    try {
      const bookings = BookingService.getBookings(movieId);
      return bookings.some(
        (booking) =>
          booking.status === "confirmed" && booking.seats.includes(seat)
      );
    } catch (error) {
      console.error("Помилка при перевірці місця:", error);
      return false;
    }
  },

  // Отримати всі заброньовані місця для фільму
  getBookedSeats: (movieId) => {
    try {
      const bookings = BookingService.getBookings(movieId);
      const bookedSeats = [];

      bookings.forEach((booking) => {
        if (booking.status === "confirmed") {
          bookedSeats.push(...booking.seats);
        }
      });

      return [...new Set(bookedSeats)]; // Унікальні місця
    } catch (error) {
      console.error("Помилка при отриманні заброньованих місць:", error);
      return [];
    }
  },

  // Отримати статистику бронювань для фільму
  getBookingStats: (movieId) => {
    try {
      const bookings = BookingService.getBookings(movieId);
      const totalSeats = 120; // 10 рядів по 12 місць
      const bookedSeats = BookingService.getBookedSeats(movieId);

      return {
        totalBookings: bookings.length,
        totalBookedSeats: bookedSeats.length,
        availableSeats: totalSeats - bookedSeats.length,
        occupancyRate: ((bookedSeats.length / totalSeats) * 100).toFixed(1),
      };
    } catch (error) {
      console.error("Помилка при отриманні статистики:", error);
      return {
        totalBookings: 0,
        totalBookedSeats: 0,
        availableSeats: 120,
        occupancyRate: "0.0",
      };
    }
  },

  // Скасувати бронювання (додаткова функціональність)
  cancelBooking: (movieId, bookingId) => {
    try {
      const bookings = JSON.parse(localStorage.getItem(BOOKING_KEY) || "{}");

      if (bookings[movieId]) {
        const bookingIndex = bookings[movieId].findIndex(
          (b) => b.id === bookingId
        );

        if (bookingIndex !== -1) {
          bookings[movieId][bookingIndex].status = "cancelled";
          localStorage.setItem(BOOKING_KEY, JSON.stringify(bookings));
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Помилка при скасуванні бронювання:", error);
      return false;
    }
  },

  // Очистити всі бронювання (для тестування)
  clearAllBookings: () => {
    try {
      localStorage.removeItem(BOOKING_KEY);
      return true;
    } catch (error) {
      console.error("Помилка при очищенні бронювань:", error);
      return false;
    }
  },

  // Отримати всі бронювання користувача по email
  getUserBookings: (email) => {
    try {
      const allBookings = JSON.parse(localStorage.getItem(BOOKING_KEY) || "{}");
      const userBookings = [];

      Object.keys(allBookings).forEach((movieId) => {
        allBookings[movieId].forEach((booking) => {
          if (
            booking.userData.email === email &&
            booking.status === "confirmed"
          ) {
            userBookings.push({
              ...booking,
              movieId: parseInt(movieId),
            });
          }
        });
      });

      return userBookings;
    } catch (error) {
      console.error("Помилка при отриманні бронювань користувача:", error);
      return [];
    }
  },
};

export default BookingService;
