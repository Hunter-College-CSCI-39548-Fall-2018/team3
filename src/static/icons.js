var fs = require('fs');
const dir = './images';
let files;

try {
    files = fs.readdirSync(dir);
} catch(err) {
    console.error(err);
}

// console.log(files);
//generate a random number to choose icon
let size = files.length

//read the file and return image
files[L];
function chooseIcon() {
    var L = Math.floor(Math.random()*size);
    console.log(L);
}

// for(let i in files) {
//     console.log(files[i] + '\n');
// }
