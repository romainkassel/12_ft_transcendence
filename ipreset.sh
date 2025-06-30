#!/bin/sh

# Extraire à partir du 7e caractère
#IP=$(echo "$SESSION_MANAGER" | cut -c7- | cut -d. -f1)

IP=localhost

FILES="./front-end/index.html ./front-end/src/socket.ts ./front-end/src/common/data.ts ./back-end/src/server.js ./front-end/src/common/avatar.ts"

for file in $FILES; do
  if [ -f "$file" ]; then
    sed -i "s/$IP/{TRANSCENDENCE_IP}/g" "$file"
    echo "IP remplacée dans $file"
  else
    echo "Fichier non trouvé : $file"
  fi
done