# Odaberite base image za Docker
FROM postgres:latest

# Definisanje environment varijable za postavke passworda baze
ENV POSTGRES_PASSWORD=postgres

# Definisanje environment varijable za postavke baze
ENV POSTGRES_DB=ikbs

# Otvaranje porta za pristup bazi podataka
EXPOSE 5432
