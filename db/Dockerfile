# Use official PostgreSQL image
FROM postgres:16

# Copy initialization SQL scripts (executed on first container start)
# Place your SQL files in ./schemas in your project
COPY ./schemas /docker-entrypoint-initdb.d