import { SafepayResource } from "../../SafepayResource.js";
const safepayMethod = SafepayResource.method;

export const Logout = SafepayResource.extend({
    basePath: "/auth",

    logoutUser: safepayMethod({
        method: "POST",
        path: "/v2/user/logout",
    }),

});
