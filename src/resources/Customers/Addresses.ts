import { SafepayResource } from "../../SafepayResource.js";
const safepayMethod = SafepayResource.method;

export const Addresses = SafepayResource.extend({
  basePath: "/user",

  create: safepayMethod({
    method: "POST",
    path: "/address/v2/",
  }),

  update: safepayMethod({
    method: "PUT",
    path: "/address/v2/{address}",
  }),

  find: safepayMethod({
    method: "GET",
    path: "/address/v2/{address}",
  }),
});
