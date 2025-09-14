-- Create databases
CREATE DATABASE octopususerdb;
CREATE DATABASE octopusproductdb;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE octopususerdb TO postgres;
GRANT ALL PRIVILEGES ON DATABASE octopusproductdb TO postgres;
