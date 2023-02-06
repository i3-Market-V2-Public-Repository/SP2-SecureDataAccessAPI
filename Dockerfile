FROM node:16

COPY . /secure-data-access-api/

WORKDIR /secure-data-access-api

RUN chmod +x ./scripts/dependencies.sh && bash ./scripts/dependencies.sh
RUN chmod +x ./scripts/library_update.sh && bash ./scripts/library_update.sh

CMD ["npm", "start"]
