CREATE TABLE IF NOT EXISTS log_game_round (
	id serial,
    game_label VARCHAR(255) NOT NULL,
    player_name VARCHAR(255) NOT NULL,
    cards_played JSON NOT NULL,
    cards_purchased JSON NOT NULL,
    player_turn INT,
    turn_index INT,
    PRIMARY KEY (id, game_label, player_name)
)