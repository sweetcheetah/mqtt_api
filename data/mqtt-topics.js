var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://10.0.0.200')

client.on('connect', function () {
  // TODO read topics from process.env
  client.subscribe('/bus/1/temp', function (err) {
    if (err) {
      console.log(err)
      console.log("ending mqtt session")
      client.end()
    }
  })
})


module.exports = client
