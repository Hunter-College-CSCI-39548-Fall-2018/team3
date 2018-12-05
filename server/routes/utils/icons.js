var fs = require('fs');
const dir = '../../src/static/images';
let files;

try {
    files = fs.readdirSync(dir);
} catch(err) {
    console.error(err);
}

let size = files.length

Array.prototype.unique = function() {
    return this.filter(function (value, index, self) { 
      return self.indexOf(value) === index;
    });
}

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
//generates array of unique icons 
function generateIcons(number) {
    var icons = [];
    for(let i = 0; i<number; ++i) {
        index = generateIndex(size);
        icon = generateIcon(index);
        console.log(icon);
        icons.push(icon);
    }
    while(icons.unique().length<number) {
        index = generateIndex(size);
        icon = generateIcon(index);
        icons.push(icon);
    }
    // console.log(icons.unique());
    return icons.unique();
}

// generateIcons(6);

let omit = generateIndex(size);
// let topIcon = generateIcon(index);
// console.log(topIcon);
let playersIcons = [];  //array of array player icons
// let playerIcons = [];

//generates  icons for each player minus the omitted
function generateIconsBlah(num, omit) {
    var icons = [];
    for(let i = 0; i<num; ++i){
        index = generateIndex(size);
        while(index === omit) {
            index = generateIndex(size);
        }
        icon = generateIcon(index);
        console.log(icon);
        icons.push(icon);
    }
    while(icons.unique().length<num) {
        index = generateIndex(size);
        icon = generateIcon(index);
        icons.push(icon);
    }
    // console.log(icons.unique());
    return icons.unique();
}

// generateIconsBlah(3,0);

// generates the icons for each player
function generateGameIcons(omit, numberOfPlayers) {
    for(let i = 0; i<numberOfPlayers; ++i){
        // (function(){
            let playerIcons = generateIconsBlah(4, omit);
            console.log(playerIcons);
            playersIcons.push(playerIcons);
        // })()
    }
    //replace a random choice from a random player
    var player = Math.floor(Math.random() * numberOfPlayers);
    var choice = Math.floor(Math.random() * 4);
    console.log(player, choice, files[omit]);
    console.log("\n before changing", playersIcons);
    playersIcons[player][choice] = files[omit];
    console.log("\n after changing");
    // console.log(playersIcons);
    // while(playersIcons[player].unique().length<4) {
    //     index = generateIndex(size);
    //     icon = generateIcon(index);
    //     playersIcons[player].push(icon);
    // }
    console.log(playersIcons);
    return playersIcons;
}

enumerateIcons = () => {
    let icons = {}

    for(let i = 0; i < files.length; i++){
        icons[i] = files[i]
    }

    return icons
}

generateGameIcons(0, 2);