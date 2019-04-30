#!/bin/sh

#initializing database
mkdir -p ./mongo/data
nohup mongod --dbpath='./mongo/data' >> database.log &

#initializing client
cd ./client
npm i
nohup npm run serve >> ../client.log &

#initializing server
cd ../server/
npm i
nodemon server.js