import {
  CSSProperties,
  ClassList,
  Signal,
  Slot,
  component$,
  createContextId,
  useContextProvider,
} from "@builder.io/qwik";
import { Epayco } from "./epayco";
import {
  EpaycoConfigI,
  EpaycoCustomerI,
  EpaycoOptionalI,
  EpaycoProductI,
} from "../../models/pay.model";

import { CRYPTER } from "../../utils/crypter.util";

export const EpaycoConfigContext =
  createContextId<EpaycoConfigI>("epayco-config");

interface Props {
  style?: string | CSSProperties;
  class?: ClassList | Signal<ClassList>;
  config: string;
  product: EpaycoProductI;
  customer: EpaycoCustomerI;
  optional?: EpaycoOptionalI;
}

export const Pay = component$<Props>((props) => {
  useContextProvider(
    EpaycoConfigContext,
    JSON.parse(CRYPTER.decrypt(props.config)),
  );

  return (
    <>
      <Epayco
        cssStyle={props.style}
        cssClass={props.class}
        product={props.product}
        customer={props.customer}
        optional={props.optional}
      >
        <Slot />
      </Epayco>
      <script
        type="text/javascript"
        src="https://checkout.epayco.co/checkout.js"
      />
    </>
  );
});
