FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install -g serve

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
