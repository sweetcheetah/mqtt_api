MQTT monitor API

/topic/<topic>/current
shows current value of a topic
for example: /topic/bus/1/temp/current
returns the current value of the topic /bus/1/temp

/topic/<topic>/past/<unit>/<quantity>
historical value of a topic
for example:  /topic/bus/1/temp/past/month/6
returns the historical value of the topic /bus/1/temp as an array of 6 elements, each value representing the average for one month
