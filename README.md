## sse-server

### redis Pub/Sub
```
PSUBSCRIBE pattern [pattern ...]
订阅一个或多个符合给定模式的频道。
127.0.0.1:6379> PSUBSCRIBE changeBicycle:*

PUBLISH channel message
将信息发送到指定的频道。
127.0.0.1:6379> PUBLISH changeBicycle:12222 "{position: []}"
```
### Server-sent Events

## docker
```
docker build -t sse-server .
docker run --name sse-server -d -p 3010:3000 sse-serve
```
