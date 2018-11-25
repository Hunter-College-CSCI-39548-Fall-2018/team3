var fs = require('fs');
const dir = '../../../src/static/images';
let files;

try {
    files = fs.readdirSync(dir);
} catch(err) {
    console.error(err);
}

let size = files.length

//generate a random number between 0 and size
function generateIndex(size) {
    return Math.floor(Math.random() * size);
}
// index = generateIndex(size);
// console.log(index);

//returns an icon
function generateIcon(num) {
    return files[num];
}
// let image = generateIcon(index);
// console.log(image)

let index;
let icon;
var icons = [];
function generateIcons(number) {
    for(let i = 0; i<number; ++i) {
        index = generateIndex(size);
        // console.log(index);
        icon = generateIcon(index);
        console.log(icon);
        icons.push(icon);
    }
    return icons;
}

generateIcons(4);