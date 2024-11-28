import { Buffer } from 'buffer';

window.Buffer = Buffer;

declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}
