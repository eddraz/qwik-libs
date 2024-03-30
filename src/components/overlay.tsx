import { QRL, Slot, component$ } from "@builder.io/qwik";

interface Props {
  onClick$?: QRL<(event: MouseEvent) => void>;
}

export const Overlay = component$<Props>(({ onClick$ }) => {
  return (
    <div
      class="fixed left-0 top-0 z-50 h-full w-full cursor-pointer"
      onClick$={onClick$}
    >
      <Slot />
    </div>
  );
});
