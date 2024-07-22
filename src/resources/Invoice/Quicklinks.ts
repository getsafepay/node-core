import { SafepayResource } from "../../SafepayResource.js";
const safepayMethod = SafepayResource.method;

export const Quicklinks = SafepayResource.extend({
  basePath: "",

  create: safepayMethod({
    method: "POST",
    path: "/quick-links/v2/",
  }),

  fetch: safepayMethod({
    method: "GET",
    path: "/quick-links/v2/{quicklink}",
  }),

  pay: safepayMethod({
    method: "POST",
    path: "/quick-links/v2/{quicklink}/pay",
  }),

  success: safepayMethod({
    method: "PUT",
    path: "/quick-links/v2/pay-success",
  }),
});
