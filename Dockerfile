FROM sqlwwx/pm2:latest

MAINTAINER sqlwwx <wwx_2012@hotmail.com>

# Expose ports
EXPOSE 3000

WORKDIR /work

COPY server server/
COPY package.json .
COPY process.json .
COPY index.js .
COPY .babelrc .

RUN npm install --production --registry=https://registry.npm.taobao.org \
  && rm -rf /tmp/*

RUN ls -al -R

# Start process.json
CMD ["pm2-docker", "start", "--auto-exit", "--env", "production", "process.json"]
