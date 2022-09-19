FROM node:14-slim

COPY . /secure-data-access-api/

WORKDIR /secure-data-access-api

COPY ./scripts/dependencies.sh ./dependencies.sh

RUN chmod +x /dependencies.sh && bash /dependencies.sh

CMD ["npm", "start"]
