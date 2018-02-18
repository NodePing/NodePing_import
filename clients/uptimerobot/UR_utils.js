const _ = require('lodash')

module.exports = {
  mapMonitorsToChecks: function(monitors) {
    console.log(monitors)
    const checks = []
    monitors.forEach((monitor) => {
      let check = {
        type: 'HTTP',
        label: monitor.friendly_name,
        target: monitor.url,
        enabled: "active",
        public: true,
        interval: monitor.interval
      }
      checks.push(check)
    })
    return checks
  }
}
