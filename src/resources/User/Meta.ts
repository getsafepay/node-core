import { SafepayResource } from "../../SafepayResource.js";
const safepayMethod = SafepayResource.method;

export const Meta = SafepayResource.extend({
  basePath: "/meta",

  country: safepayMethod({
    method: "GET",
    path: "/v2/country",
  }),

});

