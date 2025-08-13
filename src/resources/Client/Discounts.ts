import { SafepayResource } from "../../SafepayResource.js";
const safepayMethod = SafepayResource.method;

export const Discounts = SafepayResource.extend({
  basePath: "/client",

  create: safepayMethod({
    method: "POST",
    path: "/discounts/v2/",
  }),

  find: safepayMethod({
    method: "GET",
    path: "/discounts/v2/{discount_token}",
  }),

  archive: safepayMethod({
    method: "DELETE",
    path: "/discounts/v2/{discount_token}",
  }),

  update: safepayMethod({
    method: "PUT",
    path: "/discounts/v2/{discount_token}",
  }),

  list: safepayMethod({
    method: "GET",
    path: "/discounts/v2/",
  }),

  appliedList: safepayMethod({
    method: "GET",
    path: "/discounts/v2/applied/list",
  }),
});

