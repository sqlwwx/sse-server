#!/usr/bin/env sh
npm run build
docker build -t sqlwwx/sse-server:latest .
docker push sqlwwx/sse-server:latest
