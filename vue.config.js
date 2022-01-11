const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/pictures-share/" : '/',
  lintOnSave: true,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('_assets', resolve('src/assets'))
      .set('_components', resolve('src/components'))
      .set('_views', resolve('src/views'))
      .set('_network', resolve('src/network'))
      .set('_utils', resolve('src/utils'))
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-px2rem')({remUnit: 75}),
        ]
      }
    }
  },
  pwa: {
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
      importWorkboxFrom: 'local',
      importsDirectory: 'js',
      navigateFallback: '/',
      navigateFallbackBlacklist: [/\/api\//]
    }
  },
}