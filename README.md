# Express Code
Express Code is a tool used to easily create MVC Pattern using express.

### Features:
- Create Auth with a single command
- Generate App.js
- Generate Config file for db connection
- Upload Middleware to manage file uploads
- Create 
  - route
  - model 
  - controller
  - service
  using a single command
- Auto link and import route, model, controller and service

&nbsp;&nbsp;

### Cloning into express-code
```bash
    git clone https://github.com/UserRounakk/express-code.git
```
&nbsp;&nbsp;


### **Getting Started**
**#Setting up requirements:**

- Initialize node in the main project directory

```bash
    npm init -y
```
- Paste the express-code folder inside the main project directory
- Add the following lines inside script in package.json

```bash
    "requirements": "npm install nodemon express mongoose multer i bcrypt jsonwebtoken",
    "start": "nodmon app.js"
```
- Run the following command

```bash
    npm run requirements
```

**#Setup Auth**
- Navigate to express-code folder
```bash
    cd express-code
```
- Run the following command
```bash
    npm run setup auth
```
- Configure the config/config.js file according to the database configuation.
- Navigate ack to the main project folder
```bash
    cd ..
```
- Run the project
```bash
    npm start
```

**#Setup Model, Route, Controller, Service**
- Navigate to express-code folder
```bash
    cd express-code
```
- Run the following command
```bash
    npm run new {model-name}
```
- Navigate ack to the main project folder
```bash
    cd ..
```
- Run the project
```bash
    npm start
```






