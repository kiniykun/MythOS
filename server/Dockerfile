FROM node:20-alpine
WORKDIR /app
COPY . /app
ENV HOST=0.0.0.0 PORT=8080 DATA_DIR=/data
VOLUME /data
EXPOSE 8080
CMD ["node","server/server.js"]
