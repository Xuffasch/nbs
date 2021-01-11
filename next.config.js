const withWorkbox = require("next-with-workbox");

module.exports = withWorkbox({
  workbox: {
    swSrc: "service-worker.js",
  },
  images:  {
    domains: ['dl.airtable.com']
  }
});