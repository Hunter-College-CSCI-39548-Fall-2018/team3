var fs = require('fs');
const dir = './images';
let files;

try {
    files = fs.readdirSync(dir);
} catch(err) {
    console.error(err);
}

// console.log(files);
//generate a random number between 0 and size
let size = files.length
let index;
function generateIndex(size) {
    return Math.floor(Math.random() * size);
}

index = generateIndex(size);
console.log(index);

//returns an icon
function chooseIcon(index) {
    console.log(files[index]);
    return files[index];
}

chooseIcon(index);