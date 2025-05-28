class BookingService {
  static saveBooking(movieId, seatIds, userInfo) {
    try {
      console.log("Saving booking:", { movieId, seatIds, userInfo });

      // Отримуємо існуючі бронювання з localStorage
      let existingBookings = {};
      try {
        existingBookings = JSON.parse(localStorage.getItem("bookings") || "{}");
      } catch (e) {
        console.log("No existing bookings found, creating new");
        existingBookings = {};
      }

      // Перевіряємо, чи не заброньовані вже місця
      const movieBookings = existingBookings[movieId] || [];
      const alreadyBooked = seatIds.some((seatId) =>
        movieBookings.some(
          (booking) => booking.seats && booking.seats.includes(seatId)
        )
      );

      if (alreadyBooked) {
        console.log("Some seats already booked");
        return {
          success: false,
          error: "Деякі з вибраних місць вже заброньовані",
        };
      }

      // Створюємо нове бронювання
      const newBooking = {
        id: Date.now().toString(),
        movieId: movieId,
        seats: seatIds,
        userInfo: userInfo,
        bookingDate: new Date().toISOString(),
        status: "confirmed",
      };

      console.log("New booking created:", newBooking);

      // Додаємо до існуючих бронювань
      if (!existingBookings[movieId]) {
        existingBookings[movieId] = [];
      }
      existingBookings[movieId].push(newBooking);

      // Зберігаємо в localStorage
      localStorage.setItem("bookings", JSON.stringify(existingBookings));
      console.log("Booking saved to localStorage");

      return {
        success: true,
        booking: newBooking,
        message: "Бронювання успішно збережено",
      };
    } catch (error) {
      console.error("Error saving booking:", error);
      return {
        success: false,
        error: "Помилка при збереженні бронювання: " + error.message,
      };
    }
  }

  static isSeatBooked(movieId, seatId) {
    try {
      const bookedSeats = BookingService.getBookedSeats(movieId);
      return bookedSeats.includes(seatId);
    } catch (error) {
      console.error("Error checking seat booking status:", error);
      return false; // Default to false if there's an error
    }
  }

  static getBookedSeats(movieId) {
    try {
      const bookings = JSON.parse(localStorage.getItem("bookings") || "{}");
      const movieBookings = bookings[movieId] || [];

      // Повертаємо всі заброньовані місця для цього фільму
      return movieBookings.reduce((seats, booking) => {
        return seats.concat(booking.seats);
      }, []);
    } catch (error) {
      console.error("Error getting booked seats:", error);
      return [];
    }
  }

  static getAllBookings() {
    try {
      return JSON.parse(localStorage.getItem("bookings") || "{}");
    } catch (error) {
      console.error("Error getting bookings:", error);
      return {};
    }
  }

  static cancelBooking(movieId, bookingId) {
    try {
      const bookings = JSON.parse(localStorage.getItem("bookings") || "{}");

      if (bookings[movieId]) {
        bookings[movieId] = bookings[movieId].filter(
          (booking) => booking.id !== bookingId
        );

        if (bookings[movieId].length === 0) {
          delete bookings[movieId];
        }

        localStorage.setItem("bookings", JSON.stringify(bookings));

        return {
          success: true,
          message: "Бронювання скасовано",
        };
      }

      return {
        success: false,
        error: "Бронювання не знайдено",
      };
    } catch (error) {
      console.error("Error canceling booking:", error);
      return {
        success: false,
        error: "Помилка при скасуванні бронювання",
      };
    }
  }
}

export default BookingService;
