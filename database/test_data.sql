-- database/test_data.sql
-- Données de test pour Chinook (MySQL/MariaDB)
-- Prérequis: le DDL Chinook_MySql_AutoIncrementPKs.sql a été exécuté

USE chinook;
SET NAMES utf8mb4;
START TRANSACTION;

-- 1) Genres (6 inserts)
INSERT INTO Genre (Name) VALUES
('Afrobeat'),
('Synthwave'),
('Zouk'),
('K-Pop'),
('Chanson'),
('Electro Pop');

-- 2) Artists (6 inserts)
INSERT INTO Artist (Name) VALUES
('Aya Nakamura'),
('Orelsan'),
('Daft Punk'),
('Fally Ipupa'),
('Stromae'),
('Christine and the Queens');

-- 3) Albums (5 inserts) - lient aux artistes ci-dessus
INSERT INTO Album (Title, ArtistId) VALUES
('Nakamura', (SELECT ArtistId FROM Artist WHERE Name = 'Aya Nakamura' LIMIT 1)),
('Civilisation', (SELECT ArtistId FROM Artist WHERE Name = 'Orelsan' LIMIT 1)),
('Random Access Memories', (SELECT ArtistId FROM Artist WHERE Name = 'Daft Punk' LIMIT 1)),
('Tokoos II', (SELECT ArtistId FROM Artist WHERE Name = 'Fally Ipupa' LIMIT 1)),
('Racine Carrée', (SELECT ArtistId FROM Artist WHERE Name = 'Stromae' LIMIT 1));

-- 4) Tracks (8 inserts) - inclut MediaTypeId requis par Chinook
-- On prend un media type existant ('MPEG audio file') depuis la table MediaType
-- Colonnes de Track: Name, AlbumId, MediaTypeId, GenreId, Composer, Milliseconds, Bytes, UnitPrice
INSERT INTO Track
  (Name, AlbumId, MediaTypeId, GenreId, Composer, Milliseconds, Bytes, UnitPrice)
VALUES
('Djadja',
  (SELECT AlbumId FROM Album WHERE Title = 'Nakamura' LIMIT 1),
  (SELECT MediaTypeId FROM MediaType WHERE Name = 'MPEG audio file' LIMIT 1),
  (SELECT GenreId FROM Genre WHERE Name = 'Zouk' LIMIT 1),
  'Aya Nakamura', 180000, 0, 0.99),

('Pookie',
  (SELECT AlbumId FROM Album WHERE Title = 'Nakamura' LIMIT 1),
  (SELECT MediaTypeId FROM MediaType WHERE Name = 'MPEG audio file' LIMIT 1),
  (SELECT GenreId FROM Genre WHERE Name = 'Electro Pop' LIMIT 1),
  'Aya Nakamura', 175000, 0, 0.99),

('Lodeur de lessence',
  (SELECT AlbumId FROM Album WHERE Title = 'Civilisation' LIMIT 1),
  (SELECT MediaTypeId FROM MediaType WHERE Name = 'MPEG audio file' LIMIT 1),
  (SELECT GenreId FROM Genre WHERE Name = 'Synthwave' LIMIT 1),
  'Orelsan', 210000, 0, 0.99),

('La Quête',
  (SELECT AlbumId FROM Album WHERE Title = 'Civilisation' LIMIT 1),
  (SELECT MediaTypeId FROM MediaType WHERE Name = 'MPEG audio file' LIMIT 1),
  (SELECT GenreId FROM Genre WHERE Name = 'Chanson' LIMIT 1),
  'Orelsan', 190000, 0, 0.99),

('Get Lucky',
  (SELECT AlbumId FROM Album WHERE Title = 'Random Access Memories' LIMIT 1),
  (SELECT MediaTypeId FROM MediaType WHERE Name = 'MPEG audio file' LIMIT 1),
  (SELECT GenreId FROM Genre WHERE Name = 'Electro Pop' LIMIT 1),
  'Daft Punk', 248000, 0, 1.29),

('Instant Crush',
  (SELECT AlbumId FROM Album WHERE Title = 'Random Access Memories' LIMIT 1),
  (SELECT MediaTypeId FROM MediaType WHERE Name = 'MPEG audio file' LIMIT 1),
  (SELECT GenreId FROM Genre WHERE Name = 'Electro Pop' LIMIT 1),
  'Daft Punk', 337000, 0, 1.29),

('Amore',
  (SELECT AlbumId FROM Album WHERE Title = 'Tokoos II' LIMIT 1),
  (SELECT MediaTypeId FROM MediaType WHERE Name = 'MPEG audio file' LIMIT 1),
  (SELECT GenreId FROM Genre WHERE Name = 'Afrobeat' LIMIT 1),
  'Fally Ipupa', 230000, 0, 0.99),

('Formidable',
  (SELECT AlbumId FROM Album WHERE Title = 'Racine Carrée' LIMIT 1),
  (SELECT MediaTypeId FROM MediaType WHERE Name = 'MPEG audio file' LIMIT 1),
  (SELECT GenreId FROM Genre WHERE Name = 'Chanson' LIMIT 1),
  'Stromae', 202000, 0, 0.99);

COMMIT;
