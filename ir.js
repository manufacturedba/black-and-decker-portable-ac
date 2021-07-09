const CONST_HZ = 36000;
const HEADER_PULSE = 3000;
const HEADER_PAUSE = 1500;
const PULSE = 400;
const FILLED_PAUSE = 1200;
const EMPTY_PAUSE = 400;

/**
 * Compatible with Flic SDK's message structure
 * Likely can be stripped to be more generic?
 * https://hubsdk.flic.io/static/documentation/#35_record
 *
 * First value is frequency in Hz
 * Second and third values are "header" pulses and pauses
 * Fifth value is first significant pause
 * All pulses are ignored
 *
 * @param {array[number]} pulses
 * @returns {array[string]}
 */
function from(pulses) {
  let list = [];
  let byteBuffer = "";

  for (var i = 4; i < pulses.length; i++) {
    if (i % 2) {
      // Enjoy the silence
    } else {
      if (pulses[i] >= 700) {
        byteBuffer += 1;
      } else {
        byteBuffer += 0;
      }

      if (!(current.length % 8)) {
        list.push(byteBuffer);
        byteBuffer = "";
      }
    }
  }
}

/**
 * Translate array of bytes to complete IR message as array of pulses and pauses
 * e.x. ['11000100', '11010011', '01100100', '10000000', '00000000']
 *
 * @param {array[string]} bytes
 * @returns {array[number]}
 */
function to(bytes) {
  const packet = [CONST_HZ, HEADER_PULSE, HEADER_PAUSE];

  bytes.forEach(byte => {
    byte.split('').forEach((bit) => {
      // Each bit starts with a pulse
      packet.push(PULSE);

      if (Number(bit)) {
        packet.push(FILLED_PAUSE);
      } else {
        packet.push(EMPTY_PAUSE);
      }
    });
  });

  // Last pulse finishes the message
  packet.push(PULSE);

  return packet;
}

module.exports = {
  from,
  to,
}