export class Crypter {
  static encrypt(input: string) {
    return new TextEncoder().encode(input);
  }

  static decrypt(input: string | AllowSharedBufferSource) {
    if (typeof input === 'string') {
      // Si es un string, convertirlo a un buffer
      return input;
    }
    // Si ya es un buffer, decodificarlo
    return new TextDecoder().decode(input);
  }
}

export const CRYPTER = Crypter;
