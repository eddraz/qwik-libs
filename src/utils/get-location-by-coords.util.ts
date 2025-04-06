export interface GeocodeResponse {
  documentation: "string";
  licenses: {
    name: string;
    url: string;
  }[];
  rate: {
    limit: number;
    remaining: number;
    liresetmit: number;
  };
  results: {
    annotations: {
      DMS: { lat: string; lng: string };
      MGRS: string;
      Maidenhead: string;
      Mercator: { x: number; y: number };
      OSM: { edit_url: string; note_url: string; url: string };
      UN_M49: { regions: any; statistical_groupings: string[] };
      callingcode: number;
      currency: {
        alternate_symbols: string[];
        decimal_mark: string;
        disambiguate_symbol: string;
        html_entity: string;
        iso_code: string;
      };
      flag: string;
      geohash: string;
      qibla: number;
      roadinfo: { drive_on: string; road: string; speed_in: string };
      sun: {
        rise: {
          apparent: number;
          astronomical: number;
          civil: number;
          nautical: number;
        };
        set: {
          apparent: number;
          astronomical: number;
          civil: number;
          nautical: number;
        };
      };
      timezone: {
        name: string;
        now_in_dst: number;
        offset_sec: number;
        offset_string: string;
        short_name: string;
      };
      what3words: { words: string };
    };
    bounds: {
      northeast: { lat: number; lng: number };
      southwest: { lat: number; lng: number };
    };
    components: {
      "ISO_3166-1_alpha-2": string;
      "ISO_3166-1_alpha-3": string;
      building: string;
      city: string;
      continent: string;
      country: string;
      country_code: string;
      house_number: string;
      neighbourhood: string;
      postcode: string;
      quarter: string;
      region: string;
      road: string;
      state: string;
      suburb: string;
      _category: string;
      _type: string;
    };
    confidence: number;
    formatted: string;
    geometry: {
      lat: number;
      lng: number;
    };
  };
  status: {
    code: number;
    message: string;
  };
  stay_informed: {
    blog: string;
    twitter: string;
  };
  thanks: string;
  timestamp: {
    created_http: string;
    created_unix: number;
  };
  total_results: number;
}

export const getByCoords = (
  lat: number,
  lng: number,
  key: string,
): Promise<GeocodeResponse> => {
  return fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${lat},${lng}&key=${key}&language=es&pretty=1`,
  ).then((response) => response.json());
};
