-- Membuat database steam_catalog
CREATE DATABASE IF NOT EXISTS steam_catalog;

-- Menggunakan database steam_catalog
USE steam_catalog;

-- Membuat tabel games
CREATE TABLE IF NOT EXISTS games (
    id_game INT AUTO_INCREMENT PRIMARY KEY,
    nama_game VARCHAR(255) NOT NULL,
    developer VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    harga DECIMAL(10,2) NOT NULL
);

-- Menambahkan beberapa data contoh ke tabel games
INSERT INTO games (nama_game, developer, genre, harga) VALUES
('Cyber Battle', 'Cyber Studios', 'Action', 49.99),
('Fantasy Quest', 'DreamWorks Games', 'RPG', 59.99),
('Speed Racer', 'FastLane Devs', 'Racing', 29.99),
('Puzzle Mania', 'Brainy Games', 'Puzzle', 19.99),
('Space Adventure', 'Galactic Studio', 'Adventure', 39.99);

-- Menampilkan data dari tabel games
SELECT * FROM games;
