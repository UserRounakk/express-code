const fs = require('fs');
const content = require('./content');
const { appendPos, appendEndPos } = require('./functions');
const inflect = require('i')();

function expressCode() {
    if (process.argv.length > 2) {
        let name = process.argv[2];
        name = inflect.titleize(name)
        let lowecaseName = name.toLowerCase();


        //create app.js file
        if (!fs.existsSync('app.js')) {
            try {
                fs.writeFile('app.js', content.app, function (err) {
                    if (err) throw err;
                });
            } catch (err) {
                console.log(err);
            }
        }

        // Create app folder if it doesnt exist
        if (!fs.existsSync('app')) {
            fs.mkdirSync("app")
        }

        //create config folder
        if (!fs.existsSync('config')) {
            fs.mkdirSync("config")
        }

        //creating config file with definations
        if (!fs.existsSync('config/config.js')) {
            try {
                fs.writeFile('config/config.js', content.config, function (err) {
                    if (err) throw err;
                });
            } catch (err) {
                console.log(err);
            }
        }

        //create routes folder
        if (!fs.existsSync('routes')) {
            fs.mkdirSync("routes")
        }
        //creating routes.js
        if (!fs.existsSync('routes/routes.js')) {
            try {
                fs.writeFileSync('routes/routes.js', content.route, { encoding: "utf-8", flag: "w" });
            } catch (err) {
                console.log(err);
            }
        }

        if (!fs.existsSync(`routes/${lowecaseName}.route.js`)) {
            try {
                fs.writeFileSync(`routes/${lowecaseName}.routes.js`, content.newRoute.content(lowecaseName), { encoding: "utf-8", flag: "w" });

                //import new route into main route
                appendPos('routes/routes.js', 59, content.newRoute.require(lowecaseName));

                //use new route in the main route
                appendEndPos('routes/routes.js', 23, content.newRoute.use(lowecaseName));
            } catch (err) {
                console.log(err);
            }
        }

        //creating model
        if (!fs.existsSync('app/models')) {
            fs.mkdirSync("app/models", { recursive: true })
        }
        if (!fs.existsSync(`app/models/${lowecaseName}.model.js`)) {
            try {
                fs.writeFileSync(`app/models/${lowecaseName}.model.js`, content.newModel(name), { encoding: "utf-8", flag: "w" });
            } catch (err) {
                console.log(err);
            }
        }


        //creating controller
        if (!fs.existsSync('app/controllers')) {
            fs.mkdirSync("app/controllers", { recursive: true })
        }
        if (!fs.existsSync(`app/controllers/${lowecaseName}.controller.js`)) {
            try {
                fs.writeFileSync(`app/controllers/${lowecaseName}.controller.js`, content.newController(name), { encoding: "utf-8", flag: "w" });
            } catch (err) {
                console.log(err);
            }
        }

        //creating middlewares
        if (!fs.existsSync('app/middlewares')) {
            fs.mkdirSync("app/middlewares", { recursive: true })
        }
        //uploader middleware
        if (!fs.existsSync(`app/middlewares/uploader.middleware.js`)) {
            try {
                fs.writeFileSync(`app/middlewares/uploader.middleware.js`, content.uploader, { encoding: "utf-8", flag: "w" });
            } catch (err) {
                console.log(err);
            }
        }

        //creating service
        if (!fs.existsSync('app/services')) {
            fs.mkdirSync("app/services", { recursive: true })
        }
        if (!fs.existsSync(`app/services/${lowecaseName}.service.js`)) {
            try {
                fs.writeFileSync(`app/services/${lowecaseName}.service.js`, content.newService(name), { encoding: "utf-8", flag: "w" });
            } catch (err) {
                console.log(err);
            }
        }
    } else {
        console.log(`Inavlid Syntax: "Name must be defined"`);
    }
}

module.exports = expressCode;