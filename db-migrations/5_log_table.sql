CREATE TABLE IF NOT EXISTS log_game_round (
	id serial,
    game_label VARCHAR(255) NOT NULL,
    player_turn INT,
    turn_index INT,
    player_name VARCHAR(255) NOT NULL,
    cards_played JSON NOT NULL,
    cards_purchased JSON NOT NULL,
    PRIMARY KEY (id, game_label, player_name)
);

CREATE TABLE IF NOT EXISTS known_usernames (
    username VARCHAR(255) NOT NULL PRIMARY KEY,
    player_name VARCHAR(255) NOT NULL
)