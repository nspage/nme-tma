import { Buffer } from 'buffer';
import process from 'process/browser';
import util from 'util';

window.Buffer = Buffer;
window.process = process;
window.util = util;

declare global {
  interface Window {
    Buffer: typeof Buffer;
    process: typeof process;
    util: typeof util;
  }
}
