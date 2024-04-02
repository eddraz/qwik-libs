export interface EpaycoConfigI {
  key?: string;
  test?: boolean;
  external: "true" | "false";
  methodsDisable: "TDC" | "PSE" | "SP" | "CASH" | "DP"[];
}

//Parametros compra (obligatorio)
export interface EpaycoProductI {
  name: string; // Vestido Mujer Primavera"
  description: string; // Vestido Mujer Primavera"
  invoice: string; // "FAC-1234"
  currency: string; // "cop"
  amount: string; // "5000"
  tax_base: string; // "4000"
  tax: string; // "500"
  tax_ico: string; // "500"
  country: string; // co
  lang: string; // en
}

export interface EpaycoOptionalI {
  extra1: string; // "extra1"
  extra2: string; // "extra2"
  extra3: string; // "extra3"
  confirmation: string; // "http://secure2.payco.co/prueba_curl.php"
  response: string; // "http://secure2.payco.co/prueba_curl.php"
}

export interface EpaycoCustomerI {
  name_billing: string; //"Jhon Doe"
  address_billing: string; //"Carrera 19 numero 14 91"
  type_doc_billing: string; //"cc"
  mobilephone_billing: string; //"3050000000"
  number_doc_billing: string; //"100000000"
}
