# Hypertube

Ce projet vous propose de créer une application web permettant à un utilisateur de rechercher et visionner des vidéos.

Le lecteur sera directement intégré au site, et les vidéos seront téléchargées au travers du protocole BitTorrent. Une fois un élément sélectionné, il sera téléchargé sur le serveur et diffusé sur le player web en même temps. Autrement dit, le lecteur ne se contentera pas d’afficher la vidéo une fois le téléchargement complété, mais sera capable de streamer directement le flux.

## Technologies

- VueJS
- Express
- NodeJS
- MongoDB
- Socket.io

### Fonctionnalités

- Connexion et inscrition via local stratégie et omniauth (Google, Slack, Discord, Github, Twitch, 42)
- Recherche de torrent via RARBG et YTS.AM
- Conversion du flux vidéo à la volée en format webm (240p, 360p, 480p, 720p, 1080p)
