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
  product: EpaycoProductI;
  customer: EpaycoCustomerI;
  optional?: EpaycoOptionalI;
}

export const Epayco = component$<Props>(
  ({ cssStyle, cssClass, product, customer, optional }) => {
    const config$ = useContext(EpaycoConfigContext);

    return (
      <>
        <button
          style={cssStyle}
          class={cssClass}
          onClick$={() => {
            const handler = ePayco.checkout.configure(config$);

            handler.open({
              //Parametros compra (obligatorio)
              ...product,

              //Onpage="false" - Standard="true"
              external: config$.external,

              //Atributos opcionales
              ...optional,

              //Atributos cliente
              ...customer,

              //atributo deshabilitación método de pago
              methodsDisable: config$.methodsDisable,
            });
          }}
        >
          <Slot />
        </button>
      </>
    );
  },
);
