const inflect = require('i')();
const content = {
    config:
        `const CONFIG = {
    DB_URL: 'db_name',
    DB_NAME: 'db_url'
};
module.exports = CONFIG;`,

    app:
        `const express = require('express');
const app = express();

require('./app/services/mongoose.services');

const routes = require('./routes/routes');


app.use("/images", express.static(process.cwd()+"/public/uploads"))
app.use(express.json());

app.use('/', routes);

app.use((req, res, next) => {
    next({
        status: 404,
        msg: "Page Not found"
    });
});

app.use((err, req, res, next) => {
    res.status(err.status_code).json({
        status_code: err.status_code ?? 500,
        msg: err.msg ?? 'Server Error',
        status: false
    })
})

app.listen(8080, 'localhost', (err) => {
    if (err) console.log('Error in port 8080');
    else {
        console.log("Server is live");
    }
})

`,

    uploader:
        `const multer = require('multer');
const fs = require('fs');

const myStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let path = req.dir;

        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true })
        }


        cb(null, path);
    },
    filename: (req, file, cb) => {
        let filename = Date.now() + '-' + file.originalname;
        cb(null, filename);
    }
})

const imageFilter = (req, file, cb) => {
    let ext = file.originalname.split('.').pop();
    let allowed_extension = ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'svg'];
    if (allowed_extension.includes(ext.toLowerCase())) {
        cb(null, true)
    } else {
        cb({
            status_code: 400,
            msg: "Unsupported file format"
        }, null)
    }
}

const uplaoder = multer({
    storage: myStorage,
    fileFilter: imageFilter
})

module.exports = uplaoder;
`,

    route:
        `const express = require('express');
const app = express();

module.exports = app;
`,

    newRoute: {
        require: (name) => {
            return `\nconst ${name}_routes = require('./${name}.routes');`
        },
        use: (name) => {
            return `\napp.use('/${inflect.pluralize(name)}', ${name}_routes);`
        },
        content: (name) => {
            let snake_name = inflect.pluralize(name) + '_controller'
            let controller = inflect.camelize(snake_name);
            return `const router = require('express').Router();
const ${controller} = require('../app/controllers/${name}.controller');

const ${snake_name} = new ${controller};

router.route('/')
        .get()
        .post()
        .put()
        .delete()

router.route('/:id')
        .get()
        .post()
        .put()
        .delete()

module.exports = router;
`
        }
    },

    newModel: (name) => {
        return `const mongoose = require("mongoose");
const ${name}SchemaDef = new mongoose.Schema({
    //model code here
});

const ${name}Model = mongoose.model("${name}", ${name}SchemaDef);
module.exports = ${name}Model`;
    },

    newController: (name) => {
        return `const ${name}Service = require("../services/${name.toLowerCase()}.service");
class ${inflect.pluralize(name)}Controller {
    constructor() {
        this.${name.toLowerCase()}_service = new ${name}Service();
    }
    //controller operations here
}
module.exports = ${inflect.pluralize(name)}Controller;
`
    },

    newService: (name) => {
        return `const ${name}Model = require("../models/${name.toLowerCase()}.model");

class ${name}Service {

    validate${name} = (data) => {
        let msg = {};
        
        //validation properties here

        if(Object.keys(msg).length > 0){
            throw {status: 400, msg: msg}
        } else {
            return null;
        }

    }
}

module.exports = ${name}Service;`
    }
}



module.exports = content;