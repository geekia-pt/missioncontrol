// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'mission-control',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/var/www/mission-control',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        OPENCLAW_GATEWAY_URL: 'http://localhost:3333',
        OPENCLAW_WORKSPACE: '/root/.openclaw',
      },
    },
  ],
}
