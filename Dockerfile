FROM node:14-slim

#COPY ./scripts/dependencies.sh ./dependencies.sh

COPY . /secure-data-access-api/

#ENV PUBLIC_URI=http://localhost:3000
#ENV PORT=3000
#ENV BLOCK_SIZE=128

WORKDIR /secure-data-access-api

#RUN chmod +x /dependencies.sh && bash /dependencies.sh
#RUN npm install

CMD ["npm", "start"]
