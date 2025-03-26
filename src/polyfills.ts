// Polyfill for crypto.getRandomValues
if (typeof window !== 'undefined' && !window.crypto) {
    // @ts-ignore
    window.crypto = {};
  }
  
  if (typeof window !== 'undefined' && !window.crypto.getRandomValues) {
    // @ts-ignore
    window.crypto.getRandomValues = function(array: Uint8Array) {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    };
  }
  
  export {};