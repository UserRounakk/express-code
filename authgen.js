const fs = require('fs');
const content = require('./content');
const { appendPos, appendEndPos } = require('./functions');
const inflect = require('i')();

function authgen() {
    if (process.argv[2] == "auth") {
        //create app.js file
        if (!fs.existsSync('../app.js')) {
            try {
                fs.writeFile('../app.js', content.app, function (err) {
                    if (err) throw err;
                });
            } catch (err) {
                console.log(err);
            }
        }

        // Create app folder if it doesnt exist
        if (!fs.existsSync('../app')) {
            fs.mkdirSync("../app")
        }

        //create config folder
        if (!fs.existsSync('../config')) {
            fs.mkdirSync("../config")
        }

        //creating config file with definations
        if (!fs.existsSync('../config/config.js')) {
            try {
                fs.writeFile('../config/config.js', content.config, function (err) {
                    if (err) throw err;
                });
            } catch (err) {
                console.log(err);
            }
        }

        //create routes folder
        if (!fs.existsSync('../routes')) {
            fs.mkdirSync("../routes")
        }
        //creating routes.js
        if (!fs.existsSync('../routes/routes.js')) {
            try {
                fs.writeFileSync('../routes/routes.js', content.route, { encoding: "utf-8", flag: "w" });
            } catch (err) {
                console.log(err);
            }
        }

        //creating auth routes content
        if (!fs.existsSync(`../routes/auth.route.js`)) {
            try {
                fs.writeFileSync(`../routes/auth.routes.js`, content.authRoute, { encoding: "utf-8", flag: "w" });

                //import new route into main route
                appendPos('../routes/routes.js', 59, content.newRoute.require('auth'));

                //use new route in the main route
                appendEndPos('../routes/routes.js', 23, content.newRoute.authUse);
            } catch (err) {
                console.log(err);
            }
        }
        //creating user routes content
        if (!fs.existsSync(`../routes/user.route.js`)) {
            try {
                fs.writeFileSync(`../routes/user.routes.js`, content.newRoute.content('user'), { encoding: "utf-8", flag: "w" });

                //import new route into main route
                appendPos('../routes/routes.js', 59, content.newRoute.require('user'));

                //use new route in the main route
                appendEndPos('../routes/routes.js', 23, content.newRoute.use('user'));
            } catch (err) {
                console.log(err);
            }
        }

        //creating user model
        if (!fs.existsSync('../app/models')) {
            fs.mkdirSync("../app/models", { recursive: true })
        }
        if (!fs.existsSync(`../app/models/user.model.js`)) {
            try {
                fs.writeFileSync(`../app/models/user.model.js`, content.userModel, { encoding: "utf-8", flag: "w" });
            } catch (err) {
                console.log(err);
            }
        }

        //creating controllers
        if (!fs.existsSync('../app/controllers')) {
            fs.mkdirSync("../app/controllers", { recursive: true })
        }
        //auth controller
        if (!fs.existsSync(`../app/controllers/auth.controller.js`)) {
            try {
                fs.writeFileSync(`../app/controllers/auth.controller.js`, content.authController, { encoding: "utf-8", flag: "w" });
            } catch (err) {
                console.log(err);
            }
        }

        //creating middlewares
        if (!fs.existsSync('../app/middlewares')) {
            fs.mkdirSync("../app/middlewares", { recursive: true })
        }
        //uploader middleware
        if (!fs.existsSync(`../app/middlewares/uploader.middleware.js`)) {
            try {
                fs.writeFileSync(`../app/middlewares/uploader.middleware.js`, content.uploader, { encoding: "utf-8", flag: "w" });
            } catch (err) {
                console.log(err);
            }
        }
        //auth middleware
        if (!fs.existsSync(`../app/middlewares/auth.middleware.js`)) {
            try {
                fs.writeFileSync(`../app/middlewares/auth.middleware.js`, content.authMiddleware, { encoding: "utf-8", flag: "w" });
            } catch (err) {
                console.log(err);
            }
        }

        //creating service
        if (!fs.existsSync('../app/services')) {
            fs.mkdirSync("../app/services", { recursive: true })
        }
        if (!fs.existsSync(`../app/services/auth.service.js`)) {
            try {
                fs.writeFileSync(`../app/services/auth.service.js`, content.authService, { encoding: "utf-8", flag: "w" });
            } catch (err) {
                console.log(err);
            }
        }
        if (!fs.existsSync(`../app/services/mongoose.service.js`)) {
            try {
                fs.writeFileSync(`../app/services/mongoose.service.js`, content.mongooseService, { encoding: "utf-8", flag: "w" });
            } catch (err) {
                console.log(err);
            }
        }

    }
}

authgen();
module.exports = authgen;