module.exports = {
    apps: [
        {
            name: "bom-matcher",
            script: "serve",
            args: "-s build -l 3000",
            cwd: "./", // Adjust if needed, for example to your 'build' directory
            env: {
                NODE_ENV: "production"
            }
        }
    ]
};
