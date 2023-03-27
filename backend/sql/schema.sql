--
-- All SQL statements must be on a single line and end in a semicolon.
--

-- Dummy table --
DROP TABLE IF EXISTS dummy;
CREATE TABLE dummy(created TIMESTAMP WITH TIME ZONE);

-- Your database schema goes here --
DROP TABLE IF EXISTS people;
CREATE TABLE people(email varchar(30) PRIMARY KEY, pname VARCHAR(20), hash VARCHAR(256), avatar VARCHAR(1024));

DROP TABLE IF EXISTS mail;
CREATE TABLE mail(mailbox varchar(32), mail jsonb);