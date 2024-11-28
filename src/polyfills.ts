import { Buffer } from 'buffer';
import process from 'process/browser';

globalThis.Buffer = Buffer;
globalThis.process = process;

declare global {
  var Buffer: typeof Buffer;
  var process: typeof process;
}
