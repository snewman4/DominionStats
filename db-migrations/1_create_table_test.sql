-- Create the basic table
CREATE TABLE IF NOT EXISTS test_table (
    id serial PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    score INT
);

-- Insert some mock data
INSERT INTO
    test_table (name, score) 
VALUES
    ('aidan', 0),
    ('eli', 10),
    ('elizabeth', 20),
    ('matt', 30),
    ('tanner', 40)
    ;