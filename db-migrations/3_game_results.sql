DELETE FROM game_results WHERE player_num IS NULL OR victory_points IS NULL;

ALTER TABLE game_results
    ALTER COLUMN player_num set NOT NULL,
    ALTER COLUMN victory_points set NOT NULL
;

