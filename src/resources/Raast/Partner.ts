import { SafepayResource } from "../../SafepayResource.js";
const safepayMethod = SafepayResource.method;

export const Partner = SafepayResource.extend({
  basePath: "/raastwire",

  list: safepayMethod({
    method: "GET",
    path: "/v1/partners",
  })

});
