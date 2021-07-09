// First 5 bytes are constant
const HEAD = [196, 211, 100, 128, 0];

function pad(val) {
  return "00000000".substr(val.length) + val;
}

function reverse(str) {
  return String(str)
    .split("")
    .reverse()
    .join("");
}

function toBinary(num) {
  return pad(Number(num).toString(2));
}

function fromBinary(num) {
  return parseInt(num, 2);
}

function checksum(message) {
  let bits = 0;

  for (var i = 0; i < message.length; i++) {
    bits += fromBinary(reverse(toBinary(message[i])));
  }

  return fromBinary(reverse(toBinary(bits - 256)));
}

const MODES = {
  FAN: "FAN",
  COOL: "COOL",
  DEHUMID: "DEHUMID"
};

const POWER = {
  ON: 'ON',
  OFF: 'OFF',
}

const SLEEP = {
  ON: 'ON',
  OFF: 'OFF'
}

const SCALE = {
  F: 'F',
  C: 'C'
}

/**
 * TODO: Requires checks for bounds and valid configurations
 */
class Builder {
  airSwing = false;

  mode = MODES.COOL;

  power = POWER.ON;

  sleep = SLEEP.OFF;

  scale = SCALE.C;

  temp = 18; // Lowest celsius

  setPower(value = POWER.ON) {
    switch(value) {
      case(POWER.ON):
      case(POWER.OFF):
        this.power = value;
        return this;
      default:
        throw new Error(`Not a valid value for power: ${value}`);
    }
  }

  setAirSwing() {
    // TODO
    return this;
  }

  setTemperature(value, scale) {
    this.temp = value;

    switch(scale) {
      case(SCALE.C):
      case(SCALE.F):
        this.scale = scale;
        return this;
      default:
        throw new Error(`Not a valid value for scale: ${value}`);
    }
  }

  setMode(value) {
    switch(value) {
      case(MODES.FAN):
      case(MODES.COOL):
      case(MODES.DEHUMID):
        this.mode = value;
        return this;
      default:
        throw new Error(`Not a valid value for mode: ${value}`);
    }
  }

  build() {
    const message = [...HEAD];

    // 6th
    if (this.power === POWER.ON) {
      message.push(36);
    } else {
      message.push(4);
    }

    // 7th & 8th
    if (this.mode === MODES.FAN) {
      message.push(224);
      message.push(16);
    } else if(this.mode === MODES.COOL) {
      message.push(192);
      if (this.scale === SCALE.C) {
        message.push(fromBinary(reverse(toBinary(32 - this.temp))));
      } else {
        message.push(0);
      }
    } else {
      message.push(64);
      message.push(16);
    }

    // 9th
    // TODO: Missing airswing in 9th byte
    if (this.sleep === SLEEP.OFF) {
      message.push(128);
    } else {
      message.push(64);
    }

    // 10th & 11th & 12th & 13th
    // TODO: May be timer, max, or something else idk
    message.push(0);
    message.push(0);
    message.push(0);
    message.push(0);

    message.push(checksum(message))

    return message.map(toBinary);
  }
}

module.exports = {
  MODES,
  SLEEP,
  POWER,
  SCALE,

  Builder,
};
