FROM node:14-slim

COPY . /secure-data-access-api/

WORKDIR /secure-data-access-api

RUN chmod +x ./scripts/dependencies.sh && bash ./scripts/dependencies.sh

CMD ["npm", "start"]
