FROM node:20-slim
WORKDIR /workspace
COPY package*.json ./
RUN npm install --production
COPY . .
CMD ["node", "src/main.js"]
