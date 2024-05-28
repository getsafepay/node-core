import { SafepayResource } from "../../SafepayResource.js";
const safepayMethod = SafepayResource.method;

export const Object = SafepayResource.extend({
  basePath: "/",

  exists: safepayMethod({
    method: "GET",
    path: "/v2/exists",
  }),

  update: safepayMethod({
    method: "PUT",
    path: "/v2/{uid}",
  }),

  find: safepayMethod({
    method: "GET",
    path: "/v2/",
  })

});
