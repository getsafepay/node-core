import { SafepayResource } from "../../SafepayResource.js";
const safepayMethod = SafepayResource.method;

export const Cards = SafepayResource.extend({
    basePath: "/user",

    delete: safepayMethod({
        method: "DELETE",
        path: "/wallets/v1/{instrument}",
    }),

    find: safepayMethod({
        method: "GET",
        path: "/wallets/v1/{instrument}",
    }),

    list: safepayMethod({
        method: "GET",
        path: "/wallets/v1/",
    })

});
