const path = require('path');
const StreamDeck = require('elgato-stream-deck');

const myStreamDeck = new StreamDeck();

myStreamDeck.clearAllKeys();

const convertKey = keyIndex => {
    const row = Math.floor(keyIndex / 5);
    const col = 5 - (keyIndex - (5 * row)) - 1;
    return {row, col};
}

module.exports.convertKey = convertKey;
module.exports.streamDeck = myStreamDeck;
