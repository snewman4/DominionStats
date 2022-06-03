CREATE TABLE IF NOT EXISTS log_game_round (
	id serial PRIMARY KEY,
    game_label VARCHAR(255) NOT NULL,
    player_name VARCHAR(255) NOT NULL,
    cards_played JSON NOT NULL,
    cards_purchased JSON NOT NULL,
    player_turn INT,
    turn_index INT,
    CONSTRAINT
        FOREIGN KEY(game_label)
            REFERENCES game_results(game_label)
)