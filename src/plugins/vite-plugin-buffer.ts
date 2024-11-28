import type { Plugin } from 'vite';

export default function bufferPolyfill(): Plugin {
  const virtualModuleId = 'virtual:buffer-polyfill';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  return {
    name: 'vite-plugin-buffer-polyfill',
    enforce: 'pre',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `
          import { Buffer } from 'buffer';
          window.Buffer = Buffer;
          globalThis.Buffer = Buffer;
        `;
      }
    },
  };
}
