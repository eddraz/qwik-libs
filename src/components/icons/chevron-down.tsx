interface Props {
  color: string;
  height?: string;
  width?: string;
}
export const ChevronDownIcon = ({ color, height, width }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="icon icon-tabler icon-tabler-chevron-down"
      width={width || "44"}
      height={height || "44"}
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke={color || "#2c3e50"}
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M6 9l6 6l6 -6" />
    </svg>
  );
};
