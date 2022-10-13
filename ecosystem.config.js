module.exports = {
  apps : [{
    name: 'user-server',
    script: "./app.mjs",
    watch: '.',
    instances: 1,
    exec_mode: 'cluster_mode',
    env: {
      DEBUG: "notes:*,socket.io:*",
      SEQUELIZE_CONNECT:"./models/sequelize-sqlite.yaml",
      NOTES_MODEL: "sequelize",
      USER_SERVICE_URL: "http://localhost:5858"
    },
    cwd: '.'
  }]
}