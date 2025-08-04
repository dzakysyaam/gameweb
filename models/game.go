package models

type Game struct { 
	ID 		  int	  `json:"id_game"`
	Nama	  string  `json:"nama_game"`
	Developer string  `json:"developer"`
	Genre 	  string  `json:"genre"`
	Harga 	  float64 `json:"harga"`
}
