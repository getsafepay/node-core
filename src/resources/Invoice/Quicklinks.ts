import { SafepayResource } from "../../SafepayResource.js";
const safepayMethod = SafepayResource.method;

export const Object = SafepayResource.extend({
  basePath: "/quick-links",

  create: safepayMethod({
    method: "POST",
    path: "/v2",
  }),

  fetch: safepayMethod({
    method: "GET",
    path: "/v2/{quicklink}",
  }),

  pay: safepayMethod({
    method: "POST",
    path: "/v2/{quicklink}/pay",
  }),

  success: safepayMethod({
    method: "PUT",
    path: "/v2/{quicklink}/pay-success",
  }),
});
