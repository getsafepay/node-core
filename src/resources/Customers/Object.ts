import { SafepayResource } from "../../SafepayResource.js";
const safepayMethod = SafepayResource.method;

export const Object = SafepayResource.extend({
  basePath: "/user",

  create: safepayMethod({
    method: "POST",
    path: "/customers/v1/",
  }),

  update: safepayMethod({
    method: "PUT",
    path: "/customers/v1/{customer}",
  }),

  find: safepayMethod({
    method: "GET",
    path: "/customers/v1/{customer}",
  }),

  delete: safepayMethod({
    method: "DELETE",
    path: "/customers/v1/{customer}",
  }),

  list: safepayMethod({
    method: "GET",
    path: "/customers/v1/",
  }),
});
