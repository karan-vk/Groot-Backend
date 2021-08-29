const { InfluxDB, Point } = require('@influxdata/influxdb-client')

// You can generate a Token from the "Tokens Tab" in the UI
const token = 'wwti0zCHVuofd12OPjkI4svVQJHeMRjjvORAc0tuhbWaZl4cc6JmGYdU0VoayEJQtn5FQcUonjKyEfRBcd_EVg=='
const org = 'wopefa1029@enamelme.com'
const bucket = 'test'

const client = new InfluxDB({ url: 'https://us-east-1-1.aws.cloud2.influxdata.com', token: token })
const writeApi = client.getWriteApi(org, bucket)

writeApi.useDefaultTags({ location: 'groot' })
let x = 0

const loggerInflux = (req, res, time) => {
    const { method, url } = req
    const point = new Point('groot').stringField('method', method).stringField('url', url).floatField('resp', time)
    // console.log(point.fields)
    writeApi.writePoint(point)
    x += 1
    if (x == 1) {
        writeApi.flush()
        x = 0
    }
}


module.exports = { loggerInflux }

