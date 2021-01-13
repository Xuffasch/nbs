const withPlugins = require('next-compose-plugins');
const withWorkbox = require("next-with-workbox");
const withWorkers = require("@zeit/next-workers");

const nextConfig = {
  images: {
    domains: ['dl.airtable.com']
  }
};

module.exports = withPlugins([
  [withWorkbox, {
    workbox: {
      swSrc: "service-worker.js",
    }
  }],
  [withWorkers, {
    workerLoaderOptions: {
      name: 'static/[hash].worker.js',
      publicPath: '/_next/',
    }
  }],
  nextConfig,
])