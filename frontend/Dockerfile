FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY index.html .
COPY nginx.conf .
COPY vite.config.js .
COPY src ./src

RUN chown -R node:node /app
USER node

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
