export const findValueAttrInHtml = (
  attrName: string,
  value: string,
  htmlElement: HTMLElement,
) => {
  let response: string | null;

  if (attrName && value) {
    if (htmlElement) {
      const element: HTMLElement = htmlElement as unknown as HTMLElement;

      if (typeof element?.hasAttribute === "function") {
        if (attrName.search(/^data-/) >= 0 && element.ELEMENT_NODE) {
          response =
            element.querySelector(`[${attrName}="${value}"]`)?.innerHTML || "";
        } else {
          if (attrName === "id") {
            response = element.querySelector("#" + value)?.innerHTML || "";
          } else {
            console.error(
              'Error: Debes agregar el atributo id="content-item-{index}" o data-content-item="{index}"',
            );
            response = "";
          }
        }
      } else {
        console.error(`Error: El atributo '${attrName}' no existe`);
        response = null;
      }
    } else {
      console.error("Error: No existe ningún elemento");
      response = null;
    }
  } else {
    console.error(
      "Error: Debes agregar los atributos de nombre del atributo y valor a buscar ej. findValueAttrInHtml:[nombre-atributo]:[valor-atributo]",
    );
    response = null;
  }

  return response;
};
