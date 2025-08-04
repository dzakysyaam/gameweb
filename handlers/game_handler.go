package handlers

import (
	"database/sql"
	"encoding/json"
	"gameweb/configs" 
	"gameweb/models"
	"gameweb/utils"
	"net/http"
	"strconv"
)

func HandleGames(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path
	var id int
	var err error

	if len(path) > len("/api/games/") {
		id, err = strconv.Atoi(path[len("/api/games/"):])
		if err != nil {
			http.Error(w, "ID tidak valid", http.StatusBadRequest)
			return
		}
	} else {
		id = 0
	}

	switch r.Method {
	case http.MethodGet:
		handleGetGames(w, id)
	case http.MethodPost:
		handlePostGame(w, r)
	case http.MethodPut:
		handleUpdateGame(w, r, id)
	case http.MethodDelete:
		handleDeleteGame(w, id)
	}
}

func handleGetGames(w http.ResponseWriter, id int) {
	if id == 0 {
		rows, err := configs.DB.Query("SELECT id_game, nama_game, developer, genre, harga FROM games")
		if err != nil {
			http.Error(w, "Gagal mengambil data game", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var games []models.Game
		for rows.Next() {
			var game models.Game
			err := rows.Scan(&game.ID, &game.Nama, &game.Developer, &game.Genre, &game.Harga)
			if err != nil {
				http.Error(w, "Gagal memproses data game", http.StatusInternalServerError)
				return
			}
			games = append(games, game)
		}
		utils.RespondJSON(w, games)
	} else {
		var game models.Game
		err := configs.DB.QueryRow("SELECT id_game, nama_game, developer, genre, harga FROM games WHERE id_game = ?", id).
			Scan(&game.ID, &game.Nama, &game.Developer, &game.Genre, &game.Harga)
		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, "Game tidak ditemukan", http.StatusNotFound)
			} else {
				http.Error(w, "Gagal mengambil data game", http.StatusInternalServerError)
			}
			return
		}
		utils.RespondJSON(w, game)
	}
}

func handlePostGame(w http.ResponseWriter, r *http.Request) {
    var game models.Game
    if err := json.NewDecoder(r.Body).Decode(&game); err != nil {
        utils.RespondJSON(w, map[string]string{"error": "Data tidak valid"})
        return
    }
    
    _, err := configs.DB.Exec(
        "INSERT INTO games (nama_game, developer, genre, harga) VALUES (?, ?, ?, ?)",
        game.Nama, game.Developer, game.Genre, game.Harga)
    
    if err != nil {
        // This will be caught by your LogRequestHandler middleware
        utils.RespondJSON(w, map[string]string{"error": err.Error()})
        return
    }
    
    utils.RespondJSON(w, map[string]string{"message": "Game berhasil ditambahkan!"})
}

func handleUpdateGame(w http.ResponseWriter, r *http.Request, id int) {
	var game models.Game
	if err := json.NewDecoder(r.Body).Decode(&game); err != nil {
		http.Error(w, "Data tidak valid", http.StatusBadRequest)
		return
	}
	result, err := configs.DB.Exec("UPDATE games SET nama_game=?, developer=?, genre=?, harga=? WHERE id_game=?",
		game.Nama, game.Developer, game.Genre, game.Harga, id)
	if err != nil {
		http.Error(w, "Gagal memperbarui game", http.StatusInternalServerError)
		return
	}
	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, "Game dengan ID tersebut tidak ditemukan", http.StatusNotFound)
		return
	}
	utils.RespondJSON(w, map[string]string{"message": "Game berhasil diperbarui!"})
}

func handleDeleteGame(w http.ResponseWriter, id int) {
	result, err := configs.DB.Exec("DELETE FROM games WHERE id_game=?", id)
	if err != nil {
		http.Error(w, "Gagal menghapus game", http.StatusInternalServerError)
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, "Game dengan ID tersebut tidak ditemukan", http.StatusNotFound)
		return
	}

	utils.RespondJSON(w, map[string]string{"message": "Game berhasil dihapus!"})
}
