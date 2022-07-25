const inflect = require('i')();
const content = {
    config:
        `const CONFIG = {
    DB_URL: 'mongodb://127.0.0.1:27017',
    DB_NAME: 'db_name',
    JWT_SECRET: "jwt_secret"
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
        authUse: `\napp.use(auth_routes);`,
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
    },

    userModel: `const mongoose = require('mongoose');
const AddressSchemaDef = new mongoose.Schema({
    name: String,
    street_name: String,
    house_no: Number
})

const UserSchemaDef = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email:  {
        type: String,
        required: [true, "Email is required"],
        validate: {
            validator: function(em){
                // text@text.text
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(em)
            },
            message: props => "Invalid email."
        },
        unique: [true, "Email should be unique"]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    role: [{
        type: String,
        enum: ["admin", 'seller','customer'],
        default: "customer"
    }] ,
    status: {
        type: String,
        enum: ["active", 'inactive'],
        default: "active"
    } ,
    image: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        validate: {
            validator: function(v) {
                return /\d{3}-\d{3}-\d{4}/.test(v);
            },
            message: props => "Invalid phone number!"
        },
    },
    address: {
        billing: AddressSchemaDef,
        shipping: AddressSchemaDef
    }
}, {
    timestamps: true,
    autoIndex: true,
    autoCreate: true
});

// User => users
const UserModel = mongoose.model('User', UserSchemaDef);
module.exports = UserModel;`,

    authController: `const AuthService = require("../services/auth.service");
const bcrypt = require("bcrypt");

class AuthController {

    constructor() {
        this.auth_service = new AuthService();
    }

    setPath = (req,res,next)=>{
        req.dir = "public/uploads/user";
        next();
    }

    login = async (req, res, next) => {
        try {
            let data = req.body;
            let validate = this.auth_service.loginValidate(data);

            if (validate) {
                next({
                    status: 400,
                    msg: validate
                });
            } else {
                let user = await this.auth_service.login(data);
                let token = this.auth_service.getToken({
                    id: user._id,
                    name: user.name
                });
                res.json({
                    result: {
                        user: user.name + "has been logged in successfully.",
                        access_token: token
                    },
                    status: true,
                    msg: "User logged in successfully."
                })
            }
        } catch (err) {
            next({
                status: 500,
                msg: err
            });
        }
    }

    register = async (req, res, next) => {
        try {
            let data = req.body;

            if (req.file) {
                data.image = req.file.filename;
            }
            this.auth_service.registerValidate(data);

            data.password = bcrypt.hashSync(data.password, 10);

            this.auth_service.register(data)
                .then((succ) => {
                    res.json({
                        status: true,
                        msg: "User registered",
                        result: data
                    })
                }).catch((err) => {
                    next({
                        status: 400,
                        msg: err
                    })
                })

        } catch (error) {
            next({
                status: 422,
                msg: error
            })
        }
    }
}

module.exports = AuthController;
`,
    authMiddleware:
        `const jwt = require("jsonwebtoken");
const CONFIG = require("../../config/config");
const UserModel = require("../models/user.model");

const loginCheck = async (req, res, next) => {
    let token = null;
    if (req.headers['authorization']) {
        token = req.headers['authorization'];
    }

    if (req.headers['x-xsrf-token']) {
        token = req.headers['x-xsrf-token'];
    }

    if (req.query['token']) {
        token = req.query['token'];
    }

    if (!token) {
        next({
            status: 401,
            msg: "Unauthenticated"
        })
    } else {
        try {
            let token_parts = token.split(" ");
            token = token_parts.pop();

            let data = jwt.verify(token, CONFIG.JWT_SECRET)
            
            if (data) {
                let user = await UserModel.findById(data.id);
                if (user) {
                    req.auth_user = user;
                    next();
                } else {
                    next({
                        status: 401,
                        msg: "Token expired or user does not exists."
                    })
                }
            } else {
                next({
                    status: 401,
                    msg: "Unauthorized: Token mismatched"
                })
            }
        } catch (err) {
            next({
                status: 400,
                msg: err
            })
        }
    }
}

module.exports = loginCheck;
`,
    authService: `const UserModel = require('../models/user.model');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CONFIG = require("../../config/config");

class AuthService {
    loginValidate = (data) => {
        let msg = null;
        if (!data.email || !data.password) {
            msg = "Credentials are required";
        } else {
            msg = null;
        }

        return msg;
    }

    registerValidate = (data, is_update = false) => {
        let msg = null;

        if (!data.name) {
            msg['name'] = "Name is required"
        }

        if (!data.email) {
            msg['email'] = "Email is required"
        }

        if (!data.password) {
            msg['password'] = "Password is required"
        }

        if (!data.role) {
            msg['role'] = "Role is required"
        }

        if (msg) {
            throw msg

        } else {
            return null;
        }
        // return msg;
    }

    register = (data) => {
        let user = new UserModel(data);
        return user.save();
    }

    login = async (data) => {
        try {

            let user = await UserModel.findOne({
                email: data.email
            });
            if (user) {
                if (bcrypt.compareSync(data.password, user.password)) {
                    return user;
                } else {
                    throw { status: 400, msg: "Credentials does not match" }
                }
            } else {
                throw { status: 400, msg: "User does not exists." }
            }
        } catch (err) {
            throw err;
        }

    }

    getToken = (data) => {
        let token = jwt.sign(data, CONFIG.JWT_SECRET);
        return token;
    }
}

module.exports = AuthService;
`,

    authRoute: `const router = require('express').Router();
const AuthController = require("../app/controllers/auth.controller")
const auth_controller = new AuthController();
const uploader = require('../app/middleware/uploader.middleware');

router.post('/login', auth_controller.login)

router.post('/register', auth_controller.setPath, uploader.single('image'), auth_controller.register)

module.exports = router;`,
    mongooseService: `const mongoose = require("mongoose");
const CONFIG = require("../../config/config");

mongoose.connect(CONFIG.DB_URL+"/"+CONFIG.DB_NAME,{
    autoIndex: true,
    autoCreate: true
}, (err) => {
    if(err) {
        console.log("Error: ", err);
    } else {
        console.log("Mongodb connected successfully.");
    }
});`

}



module.exports = content;