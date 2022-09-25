#!/bin/bash
123
source .env;
if [ -n "${DB_USERNAME:-}" ] && [ -n "${DB_PASSWORD}" ]; then
     echo "Start generator 🚀🚀🚀"
	 yarn typeorm-model-generator -h ${DB_HOST} -d ${DB_DATABASE} -u ${DB_USERNAME} -x ${DB_PASSWORD} -e ${DB_TYPE} -p ${DB_PORT} -o ./src/database -s public --ssl
else
	echo "SETUP INFO: No Environment variables given!"
fi
