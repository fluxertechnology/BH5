import aesjs from "aes-js";

const key = [85, 51, 52, 3, 14, 48, 72, 19, 88, 9, 15, 1, 97, 5, 28, 33];

/**
 *
 *
 * @param {String} data
 */
export const encryptionData = (text) => {
  var textBytes = aesjs.utils.utf8.toBytes(text);
  // var textBytes = utf8ByteToUnicodeStr(text);

  // The counter is optional, and if omitted will begin at 1
  var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
  var encryptedBytes = aesCtr.encrypt(textBytes);

  // To print or store the binary data, you may convert it to hex
  var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
  return encryptedHex;
};

export const decryptiedData = (encryptedHex) => {
  // When ready to decrypt the hex string, convert it back to bytes
  var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);

  // The counter mode of operation maintains internal state, so to
  // decrypt a new instance must be instantiated.
  var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
  var decryptedBytes = aesCtr.decrypt(encryptedBytes);

  // Convert our bytes back into text
  var decryptedText = utf8ByteToUnicodeStr(decryptedBytes);
  return decryptedText;
};
function utf8ByteToUnicodeStr(utf8Bytes) {
  var unicodeStr = "";
  for (var pos = 0; pos < utf8Bytes.length; ) {
    var flag = utf8Bytes[pos];
    var unicode = 0;
    if (flag >>> 7 === 0) {
      unicodeStr += String.fromCharCode(utf8Bytes[pos]);
      pos += 1;
    } else if ((flag & 0xfc) === 0xfc) {
      unicode = (utf8Bytes[pos] & 0x3) << 30;
      unicode |= (utf8Bytes[pos + 1] & 0x3f) << 24;
      unicode |= (utf8Bytes[pos + 2] & 0x3f) << 18;
      unicode |= (utf8Bytes[pos + 3] & 0x3f) << 12;
      unicode |= (utf8Bytes[pos + 4] & 0x3f) << 6;
      unicode |= utf8Bytes[pos + 5] & 0x3f;
      unicodeStr += String.fromCodePoint(unicode);
      pos += 6;
    } else if ((flag & 0xf8) === 0xf8) {
      unicode = (utf8Bytes[pos] & 0x7) << 24;
      unicode |= (utf8Bytes[pos + 1] & 0x3f) << 18;
      unicode |= (utf8Bytes[pos + 2] & 0x3f) << 12;
      unicode |= (utf8Bytes[pos + 3] & 0x3f) << 6;
      unicode |= utf8Bytes[pos + 4] & 0x3f;
      unicodeStr += String.fromCodePoint(unicode);
      pos += 5;
    } else if ((flag & 0xf0) === 0xf0) {
      unicode = (utf8Bytes[pos] & 0xf) << 18;
      unicode |= (utf8Bytes[pos + 1] & 0x3f) << 12;
      unicode |= (utf8Bytes[pos + 2] & 0x3f) << 6;
      unicode |= utf8Bytes[pos + 3] & 0x3f;
      unicodeStr += String.fromCodePoint(unicode);
      pos += 4;
    } else if ((flag & 0xe0) === 0xe0) {
      unicode = (utf8Bytes[pos] & 0x1f) << 12;
      unicode |= (utf8Bytes[pos + 1] & 0x3f) << 6;
      unicode |= utf8Bytes[pos + 2] & 0x3f;
      unicodeStr += String.fromCharCode(unicode);
      pos += 3;
    } else if ((flag & 0xc0) === 0xc0) {
      //110
      unicode = (utf8Bytes[pos] & 0x3f) << 6;
      unicode |= utf8Bytes[pos + 1] & 0x3f;
      unicodeStr += String.fromCharCode(unicode);
      pos += 2;
    } else {
      unicodeStr += String.fromCharCode(utf8Bytes[pos]);
      pos += 1;
    }
  }
  return unicodeStr;
}
