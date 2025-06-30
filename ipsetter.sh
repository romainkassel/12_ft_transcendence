#!/bin/bash

# Extraire à partir du 7e caractère avec `cut`
#IP=$(echo "$SESSION_MANAGER" | cut -c7- | cut -d. -f1)

IP=localhost

# Remplace le placeholder {{IP}} par l'adresse IP réelle
sed -i "s/{TRANSCENDENCE_IP}/$IP/g" "./front-end/index.html"
sed -i "s/{TRANSCENDENCE_IP}/$IP/g" "./front-end/src/socket.ts"
sed -i "s/{TRANSCENDENCE_IP}/$IP/g" "./front-end/src/common/data.ts"
sed -i "s/{TRANSCENDENCE_IP}/$IP/g" "./back-end/src/server.js"
sed -i "s/{TRANSCENDENCE_IP}/$IP/g" "./front-end/src/common/avatar.ts"