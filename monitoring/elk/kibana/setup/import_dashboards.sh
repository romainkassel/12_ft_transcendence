#!/bin/sh

until curl -s -k -u "elastic:${ELASTIC_PASSWORD}" https://elasticsearch:9200/_cluster/health >/dev/null; do
    echo "Waiting for Elasticsearch..."
    sleep 5
done

sleep 10
TMP_DIR="/tmp/dashboards"
mkdir -p "$TMP_DIR"

for dashboard_dir in /usr/share/kibana/dashboards/*/ ; do
  if [ -d "$dashboard_dir" ]; then
    SERVICE_NAME=$(basename "$dashboard_dir")
    echo "Processing dashboards for service: $SERVICE_NAME"

    for dashboard in ${dashboard_dir}*.ndjson; do
      echo "Processing $dashboard..."
      TMP_FILE="$TMP_DIR/temp_dashboard_${SERVICE_NAME}.ndjson"

      cat "$dashboard" > "$TMP_FILE"

      echo "Importing processed dashboard..."
      curl -k -X POST "http://localhost:5601/kibana/api/saved_objects/_import?overwrite=true" \
        -H "kbn-xsrf: true" \
        -u "elastic:${ELASTIC_PASSWORD}" \
        -H "Content-Type: multipart/form-data" \
        -F "file=@${TMP_FILE}"

      rm -f "$TMP_FILE"
    done
  fi
done
