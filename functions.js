const fs = require("fs");

// function appendPos(path, position, data) {
//     try {
//         fs.readFile(path, (err, text) => {
//             if (err) throw err
//             else {
//                 let content = text.toString();
//                 console.log(content);
//                 fs.writeFile(path, content.substring(0, position) + data + content.substring(position), { encoding: "utf-8", flag: 'w' }, (error, success) => {
//                     if (error) {
//                         console.log(error);
//                     } else {
//                         console.log('updated before');
//                         return;
//                     }
//                 });
//             }
//         });
//     } catch (error) {
//         console.log(error);
//     }
// }
// function appendEndPos(path, position, data) {
//     try {
//         fs.readFile(path, (err, text) => {
//             if (err) throw err
//             else {
//                 let content = text.toString();
//                 console.log("\nnew\n");
//                 console.log(content);
//                 fs.writeFile(path, content.substring(0, content.length - position) + data + content.substring(content.length - position), { encoding: "utf-8", flag: 'w' }, (error, success) => {
//                     if (error) {
//                         console.log(error);
//                     } else {
//                         console.log('updated');
//                         return;
//                     }
//                 });
//             }
//         });

//     } catch (error) {
//         console.log(error);
//     }
// }

// module.exports = { appendPos, appendEndPos };

function appendPos(path, position, data) {
    try {
        let content = fs.readFileSync(path, { encoding: "utf-8" })
        fs.writeFileSync(path, content.substring(0, position) + data + content.substring(position), { encoding: "utf-8", flag: 'w' });
    } catch (err) {
        console.log(err);
    }
}
function appendEndPos(path, position, data) {
    try {
        let content = fs.readFileSync(path, { encoding: "utf-8" })
        fs.writeFileSync(path, content.substring(0, content.length - position) + data + content.substring(content.length - position), { encoding: "utf-8", flag: 'w' });
    } catch (err) {
        console.log(err);
    }
}

module.exports = { appendPos, appendEndPos };