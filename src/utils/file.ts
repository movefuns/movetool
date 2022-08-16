
import { Buffer } from 'buffer';

function toBuffer(ab: ArrayBuffer): Buffer {
    var buf = new Buffer(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
    }
    return buf;
}

export async function fileToBuffer(file: File): Promise<Buffer> {
    var fr = new FileReader();
    fr.readAsArrayBuffer(file);

    return new Promise((resolve, reject) => {
        fr.onload = () => {
            resolve(toBuffer(fr.result as ArrayBuffer));
        };

        fr.onerror = (err) => {
            reject(err);
        };

        fr.onabort = (err) => {
            reject(err);
        };
    });
}