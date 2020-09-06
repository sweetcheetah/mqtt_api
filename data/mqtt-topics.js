var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://10.0.0.200')

client.on('connect', function () {
  // TODO read topics from config.json
  client.subscribe('/bus/1/temp', function (err) {
    if (err) {
      console.log(err)
      console.log("ending mqtt session")
      client.end()
    }
  })


  client.subscribe('/bus/1/humidity', function (err) {
    if (err) {
      console.log(err)
      console.log("ending mqtt session")
      client.end()
    }
  })
})


module.exports = client
