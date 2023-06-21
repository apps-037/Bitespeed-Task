FROM node:14

# Install the default-mysql-client package
RUN apt-get update && apt-get install -y default-mysql-client

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
