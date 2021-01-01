var mqtt = require('mqtt');
var client  = mqtt.connect(process.env.MQTT_URL);

client.on('connect', function () {
  // TODO read topics from config.json
  client.subscribe('bus/1/temp', function (err) {
    if (err) {
      console.log(err);
      console.log("ending mqtt session");
      client.end();
    }
  });


  client.subscribe('bus/1/humidity', function (err) {
    if (err) {
      console.log(err);
      console.log("ending mqtt session");
      client.end();
    }
  });
});


module.exports = client;
