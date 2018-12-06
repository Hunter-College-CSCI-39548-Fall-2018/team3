var fs = require('fs');

const _ = require('underscore')
const dir = require('path').resolve(__dirname, '../../../config/public/images')

try {
    files = fs.readdirSync(dir);
} catch(err) {
    console.error(err);
}

// let size = files.length

readFiles = (dir) => {
    let files
    
    try {
        files = fs.readdirSync(dir);
    } catch(err) {
        console.error(err);
    }

    return files
}

enumerateIcons = (files) => {
    let icons = {}

    for(let i = 0; i < files.length; i++){
        icons[i] = files[i]
    }

    return icons
}

//finds an image to omit 
omitIcon = (files) => {
    var rand_icon = Math.floor(Math.random() * files.length)
    return rand_icon
}


//distribute icons for one player (not the special one)
generateIcons = (omitted_icon, enum_icons, files) => {
    let icons = []
    let rand_num

    //generate random icons for one person, and not include omitted
    for(let i = 0; i < 4; i++){
        rand_num = Math.floor(Math.random() * files.length)
        //keep going until get to number that's not omitted
        while(rand_num == omitted_icon){
            rand_num = Math.floor(Math.random() * files.length)
        }

        icons.push({icon: enum_icons[rand_num], rand_num})
    }

    return icons
}

//distribute icons for player with matching icon (on game)
generateOmittedIcons = (omitted_icon, enum_icons, files) => {
    let icons = []
    let rand_num

    for(let i = 0; i < 3; i++){
        rand_num = Math.floor(Math.random() * files.length)
        icons.push({ icon:enum_icons[rand_num], index: rand_num })
    }

    icons.push({ icon: enum_icons[omitted_icon], index: omitted_icon})

    icons = _.shuffle(icons)

    return icons
}

module.exports = {
    readFiles: readFiles, 
    enumerateIcons: enumerateIcons,
    omitIcon: omitIcon,
    generateIcons: generateIcons,
    generateOmittedIcons: generateOmittedIcons
}



// Array.prototype.unique = function() {
//     return this.filter(function (value, index, self) { 
//       return self.indexOf(value) === index;
//     });
// }

// //generate a random number between 0 and size
// function generateIndex(size) {
//     return Math.floor(Math.random() * size);
// }
// // index = generateIndex(size);
// // console.log(index);

// //returns an icon
// function generateIcon(num) {
//     return files[num];
// }
// // let image = generateIcon(index);
// // console.log(image)

// let index;
// let icon;
// //generates array of unique icons 
// function generateIcons(number) {
//     var icons = [];
//     for(let i = 0; i<number; ++i) {
//         index = generateIndex(size);
//         icon = generateIcon(index);
//         console.log(icon);
//         icons.push(icon);
//     }
//     while(icons.unique().length<number) {
//         index = generateIndex(size);
//         icon = generateIcon(index);
//         icons.push(icon);
//     }
//     // console.log(icons.unique());
//     return icons.unique();
// }

// // generateIcons(6);

// let omit = generateIndex(size);
// // let topIcon = generateIcon(index);
// // console.log(topIcon);
// let playersIcons = [];  //array of array player icons
// // let playerIcons = [];

// //generates  icons for each player minus the omitted
// function generateIconsBlah(num, omit) {
//     var icons = [];
//     for(let i = 0; i<num; ++i){
//         index = generateIndex(size);
//         while(index === omit) {
//             index = generateIndex(size);
//         }
//         icon = generateIcon(index);
//         console.log(icon);
//         icons.push(icon);
//     }
//     while(icons.unique().length<num) {
//         index = generateIndex(size);
//         icon = generateIcon(index);
//         icons.push(icon);
//     }
//     // console.log(icons.unique());
//     return icons.unique();
// }

// // generateIconsBlah(3,0);

// // generates the icons for each player
// function generateGameIcons(omit, numberOfPlayers) {
//     for(let i = 0; i<numberOfPlayers; ++i){
//         // (function(){
//             let playerIcons = generateIconsBlah(4, omit);
//             console.log(playerIcons);
//             playersIcons.push(playerIcons);
//         // })()
//     }
//     //replace a random choice from a random player
//     var player = Math.floor(Math.random() * numberOfPlayers);
//     var choice = Math.floor(Math.random() * 4);
//     console.log(player, choice, files[omit]);
//     console.log("\n before changing", playersIcons);
//     playersIcons[player][choice] = files[omit];
//     console.log("\n after changing");
//     // console.log(playersIcons);
//     // while(playersIcons[player].unique().length<4) {
//     //     index = generateIndex(size);
//     //     icon = generateIcon(index);
//     //     playersIcons[player].push(icon);
//     // }
//     console.log(playersIcons);
//     return playersIcons;
// }

// generateGameIcons(0, 2);