// ESTO ES UN DECORADOR DE TYPESCRIPT, BUSCAR LA FORMA QUE FUNCIONE
export function debounce(delay: number = 5000): MethodDecorator {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    if (target) {
      const original = descriptor.value;
      const key = `__timeout__${propertyKey}`;

      descriptor.value = function (...args: any) {
        clearTimeout((this as any)[key]);
        (this as any)[key] = setTimeout(
          () => original.apply(this, args),
          delay,
        );
      };
    }

    return descriptor;
  } as MethodDecorator;
}

// @debounce(3000)
// class Prueba {
//   constructor() {
//     console.log("Prueba");
//   }
// }
