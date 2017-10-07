export default function (server) {
  process.on('SIGINT', () => {
    if (!server) {
      process.exit(0)
    }
    const cleanUp = () => {
      console.log('释放资源')
    }
    console.log('开始关闭服务')
    server.getConnections((err, count) => {
      console.log(err, count)
    })
    server.close(() => {
      console.log('closed server')
      setTimeout(() => {
        console.log('exit process')
        cleanUp()
        process.exit(0)
      }, 20000)
    })
    // 60s强制关闭
    setTimeout(() => {
      console.log('强制关闭')
      cleanUp()
      process.exit(1)
    }, 60000)
  })
  process.on('uncaughtException', function (err) {
    console.error(err)
  })
}
