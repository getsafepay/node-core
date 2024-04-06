import { createSafepay } from "./safepay.core.js";

const Safepay = createSafepay();

module.exports = Safepay;

// expose constructor as a named property to enable mocking with Sinon.JS
module.exports.Safepay = Safepay;

// Allow use with the TypeScript compiler without `esModuleInterop`.
// We may also want to add `Object.defineProperty(exports, "__esModule", {value: true});` in the future, so that Babel users will use the `default` version.
module.exports.default = Safepay;
