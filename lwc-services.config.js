// Find the full example of all available configuration options at
// https://github.com/muenzpraeger/create-lwc-app/blob/main/packages/lwc-services/example/lwc-services.config.js
module.exports = {
    resources: [
        { from: 'src/client/assets/**', to: 'dist/assets/' },

        { from: 'src/client/index.html', to: 'dist/' }
    ],

    sourceDir: './src/client'
};
