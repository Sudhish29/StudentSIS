FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY server.js .
COPY config ./config
COPY models ./models
COPY routes ./routes
COPY utils ./utils
COPY seed.js .
COPY seedStudents.js .
COPY .env.example .env.example

RUN chown -R node:node /app
USER node

EXPOSE 5000
CMD ["npm", "start"]
