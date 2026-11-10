-- Crear schemas para cada microservicio
CREATE SCHEMA IF NOT EXISTS products;
CREATE SCHEMA IF NOT EXISTS cart;
CREATE SCHEMA IF NOT EXISTS orders;

-- Grants
GRANT ALL ON SCHEMA products TO elcontainer;
GRANT ALL ON SCHEMA cart TO elcontainer;
GRANT ALL ON SCHEMA orders TO elcontainer;
