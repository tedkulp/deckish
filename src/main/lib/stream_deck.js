import path from 'path';
import StreamDeck from 'elgato-stream-deck';

export const streamDeck = new StreamDeck();
streamDeck.clearAllKeys();

export function convertKey(keyIndex) {
    const row = Math.floor(keyIndex / 5);
    const col = 5 - (keyIndex - (5 * row)) - 1;
    return {row, col};
}

export default {
    convertKey,
    streamDeck,
};