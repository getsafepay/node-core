import { SafepayResource } from "../../SafepayResource.js";
const safepayMethod = SafepayResource.method;

export const PushNotifications = SafepayResource.extend({
  basePath: "/user",

  register: safepayMethod({
    method: "POST",
    path: "/v2/push-notification/register",
  }),

  deactivate: safepayMethod({
    method: "POST",
    path: "/v2/push-notification/deactivate",
  }),

});
