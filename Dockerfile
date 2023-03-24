# Base image with latest Node.js
FROM node:18

# Install PostgreSQL
RUN apt-get update && apt-get install -y postgresql

# Define enviroment variables to PostgreSQL
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD senha
ENV POSTGRES_DB minha-base-de-dados

# Copy project files to container
COPY . /app
WORKDIR /app

# Install Node.js and dependencies
RUN npm install

# Install NestJS dependencies
RUN npm install -g @nestjs/cli
RUN nest new igma-challenge-api
WORKDIR /app/igma-challenge-api

# Expose 3000 port and start server 
EXPOSE 3000
CMD [ "npm", "run", "start:dev" ]
