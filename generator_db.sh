#!/bin/bash
123
source .env;
if [ -n "${DB_USERNAME:-}" ] && [ -n "${DB_PASSWORD}" ]; then
     echo "Start generator 🚀🚀🚀"
     rm ./src/database/ormconfig.json
     rm ./src/database/tsconfig.json
	 yarn typeorm-model-generator -h ${DB_HOST} -d ${DB_DATABASE} -u ${DB_USERNAME} -x ${DB_PASSWORD} -e ${DB_TYPE} -p ${DB_PORT} -o ./src/database -s public --ssl
     rm ./src/database/ormconfig.json
     rm ./src/database/tsconfig.json
else
	echo "SETUP INFO: No Environment variables given!"
fi
