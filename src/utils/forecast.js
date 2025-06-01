const request = require('request')

const forecast = (latitude, longitude, callback) => {
  const url = 'https://api.weatherstack.com/current?access_key=cfc1d4d1992388a6a1f14351ea11002a&query=' + latitude + ',' + longitude + '&units=f'

  request({url, json : true}, (error, {body} = {}) => {
      if (error) {
        callback('Unable to connect to weather services!', undefined)
      } else if (body.features === 0) {
        callback('Unable to find forcast', undefined)
      } else {
        const temp = body.current.temperature
        const feelsLike = body.current.feelslike
        callback(undefined, body.current.weather_descriptions + ". It is currently " + temp + " degrees. It feels like " + feelsLike + " degrees.")
      }
  }

  ) 
}

module.exports = forecast

