module.exports = {
  apps: [
    {
      name: "quiz-forge",
      script: "node_modules/.bin/next",
      args: "start -p 3000",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      },
      // Auto restart if app crashes
      autorestart: true,
      // Restart if memory exceeds 500MB
      max_memory_restart: "500M"
    }
  ]
}