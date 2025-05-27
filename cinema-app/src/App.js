// src/App.js
import React from "react";
import MovieList from "./components/MovieList";
import { movies } from "./data/movies";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">🎬 SooFilm</h1>
          <p className="app-subtitle">
            Поринь у світ кіно і зачілься, броскі, тобі треба відпочити
          </p>
        </div>
      </header>

      <main className="main-content">
        <MovieList movies={movies} />
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>&copy; 2025 SooFilm. Всі права захищені.</p>
          <p>
            Насолоджуйтесь найкращими фільмами з колишніми, теперешніми і з
            потенційними теж!
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
