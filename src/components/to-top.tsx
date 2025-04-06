import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <button
      type="button"
      id="toTop"
      onclick$={() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }}
      class="fixed right-10 bottom-10 z-50 h-10 w-10 animate-bounce rounded-full bg-black text-white hover:opacity-80"
    >
      <i class="fa-solid fa-arrow-up"></i>
    </button>
  );
});
