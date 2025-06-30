-- SQLite

-- Creation de la table users
CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	username VARCHAR(50) NOT NULL UNIQUE,
	password VARCHAR(150) NOT NULL,
	avatar_path VARCHAR(50) DEFAULT NULL,
	mail VARCHAR(50) NOT NULL UNIQUE,
	fa2_enabled BOOLEAN DEFAULT 0,
	fa2_secret TEXT
	);

-- Creation de la table friends
CREATE TABLE IF NOT EXISTS friends (
	id_user INTEGER NOT NULL,
	id_friend INTEGER NOT NULL
	);

-- Creation de la table games_2
CREATE TABLE IF NOT EXISTS games_2 (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	id_winner INTEGER NOT NULL,
	id_player_1 INTEGER NOT NULL,
	id_player_2 INTEGER NOT NULL,
	score_player_1 INTEGER NOT NULL,
	score_player_2 INTEGER NOT NULL,
	date DATETIME DEFAULT CURRENT_TIMESTAMP,
	duration NUMBER NOT NULL,
	bounces NUMBER NOT NULL,
	max_speed NUMBER NOT NULL
	);

-- Creation de la table games_4
CREATE TABLE IF NOT EXISTS games_4 (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	id_winner INTEGER NOT NULL,
	id_player_1 INTEGER NOT NULL,
	id_player_2 INTEGER NOT NULL,
	id_player_3 INTEGER NOT NULL,
	id_player_4 INTEGER NOT NULL,
	score_player_1 INTEGER NOT NULL,
	score_player_2 INTEGER NOT NULL,
	score_player_3 INTEGER NOT NULL,
	score_player_4 INTEGER NOT NULL,
	date DATETIME DEFAULT CURRENT_TIMESTAMP,
	duration NUMBER NOT NULL,
	bounces NUMBER NOT NULL,
	max_speed NUMBER NOT NULL
	);

-- Creation de la table tournament
CREATE TABLE IF NOT EXISTS tournament (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	username_player_1 VARCHAR(50) NOT NULL,
	username_player_2 VARCHAR(50) NOT NULL,
	username_player_3 VARCHAR(50) NOT NULL,
	username_player_4 VARCHAR(50) NOT NULL,
	username_winner_1 VARCHAR(50) NOT NULL,
	username_winner_2 VARCHAR(50) NOT NULL,
	username_winner_3 VARCHAR(50) NOT NULL
	);
