import {
  CSSProperties,
  ClassList,
  QRL,
  Signal,
  Slot,
  component$,
  useContext,
} from "@builder.io/qwik";
import { EpaycoConfigContext } from "./pay";
import {
  EpaycoCustomerI,
  EpaycoOptionalI,
  EpaycoProductI,
} from "../../models/pay.model";

declare const ePayco: any;

interface Epayco {
  checkout: {
    configure: QRL<(i: { key: string; test: boolean }) => void>;
    onClosed: QRL<(e: any) => void>;
    onCreated: QRL<(e: any) => void>;
    onCreatedTransactionId: QRL<(e: any) => void>;
    onErrors: QRL<() => void>;
    onLoadTransactionId: QRL<(e: any) => void>;
    onResponse: QRL<(e: any) => void>;
    open: (r: any, n: any) => void;
    openNew: QRL<() => void>;
  };
}

interface Props {
  cssStyle?: string | CSSProperties;
  cssClass?: ClassList | Signal<ClassList>;
  disabled?: boolean;
  product: EpaycoProductI;
  customer: EpaycoCustomerI;
  optional?: EpaycoOptionalI;
  onClick$?: QRL<(event: PointerEvent, element: HTMLButtonElement) => void>;
}

export const Epayco = component$<Props>(
  ({ cssStyle, cssClass, disabled, product, customer, optional, onClick$ }) => {
    const config$ = useContext(EpaycoConfigContext);

    return (
      <>
        <button
          disabled={disabled}
          style={cssStyle}
          class={cssClass}
          onClick$={(event, elem) => {
            onClick$?.(event, elem);

            const handler = ePayco.checkout.configure({
              key: config$.key,
              test: config$.test,
            });

            handler.open({
              //Parametros compra (obligatorio)
              ...product,

              //Onpage="false" - Standard="true"
              external: optional?.external,

              //Atributos opcionales
              ...optional,

              //Atributos cliente
              ...customer,

              extra1: optional?.extra1 || "",
              extra2: optional?.extra2 || "",
              extra3: optional?.extra3 || "",
              confirmation: optional?.confirmation || "",
              response: optional?.response || "",
            });
          }}
        >
          <Slot />
        </button>
      </>
    );
  },
);
