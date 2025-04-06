export const scrollPosition = async (
  element: HTMLElement,
  root: HTMLElement,
): Promise<"bottom" | "top" | undefined> => {
  try {
    const top = element.scrollTop;
    const height = root.scrollHeight;
    const offset = root.offsetHeight;

    // emit bottom event
    if (top > height - offset - 1) {
      return "bottom";
    }

    // emit top event
    if (top === 0) {
      return "top";
    }
  } catch (err) {
    console.log("Error occurred while checking scroll position");|
    console.error(err);
    throw undefined;
  }
};
