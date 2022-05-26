CREATE TABLE IF NOT EXISTS log_game_round (
	id serial PRIMARY KEY,
    game_label VARCHAR(255) NOT NULL,
    player_name VARCHAR(255) NOT NULL,
    cardsPlayed VARCHAR(8000) NOT NULL,
    cardsPurchased VARCHAR(8000) NOT NULL
)