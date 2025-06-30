#!/bin/sh

if [ ! -f /certs/ca.zip ]; then
    elasticsearch-certutil ca --silent --pem -out /certs/ca.zip
    unzip -o /certs/ca.zip -d /certs/
    echo 'zip file created'
else
    echo 'zip file already exists'
fi

if [ ! -f /usr/share/elasticsearch/config/certs/cert-config.yml ]; then
  echo 'instances:
    - name: elasticsearch
      dns: [ "elasticsearch" ]
    - name: kibana
      dns: [ "kibana" ]
    - name: logstash
      dns: [ "logstash" ]' \
  > /usr/share/elasticsearch/config/certs/cert-config.yml
fi

echo 'certifications configuration file for each ELK services'
if [ ! -f /certs/certs.zip ]; then
    elasticsearch-certutil cert --silent --pem \
    --in /usr/share/elasticsearch/config/certs/cert-config.yml \
    --ca-cert /certs/ca/ca.crt \
    --ca-key /certs/ca/ca.key \
    --out /certs/certs.zip

    echo 'certificates generated'
fi

unzip -o /certs/certs.zip -d /certs
rm /certs/ca.zip /certs/certs.zip

for service in elasticsearch kibana logstash filebeat; do
  if [ -d "/certs/$service" ]; then
    chown -R 1000:0 /certs/$service
    chmod 600 /certs/$service/*.key
    chmod 644 /certs/$service/*.crt
  fi
done

exit 0