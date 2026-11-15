// Run with: pnpm test (builds the CommonJS output, then runs node --test)
const { test } = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const createSafepay = require("../cjs/safepay.cjs.node.js");

const secret = "whsec_test_123";
const body = JSON.stringify({
  type: "payment.succeeded",
  data: { tracker: "track_123", amount: 100000, currency: "PKR" },
});
const sign = (payload, key = secret) =>
  crypto.createHmac("sha512", key).update(payload).digest("hex");

const safepay = createSafepay("sec_test", { authType: "secret" });

test("webhooks is exposed on the instance and the factory", () => {
  assert.equal(typeof safepay.webhooks.constructEvent, "function");
  assert.equal(typeof createSafepay.webhooks.constructEvent, "function");
  assert.equal(safepay.webhooks.SIGNATURE_HEADER, "x-sfpy-signature");
});

test("constructEvent returns the parsed event for a valid raw Buffer body", () => {
  const event = safepay.webhooks.constructEvent(Buffer.from(body), sign(body), secret);
  assert.equal(event.type, "payment.succeeded");
  assert.equal(event.data.tracker, "track_123");
});

test("constructEvent accepts a raw string body and an uppercase hex signature", () => {
  const event = safepay.webhooks.constructEvent(body, sign(body).toUpperCase(), secret);
  assert.equal(event.data.amount, 100000);
});

test("constructEvent accepts an already-parsed body (whole body is signed)", () => {
  const parsed = JSON.parse(body);
  const event = safepay.webhooks.constructEvent(parsed, sign(body), secret);
  assert.deepEqual(event, parsed);
});

test("constructEvent throws SafepaySignatureVerificationError on a tampered body", () => {
  const tampered = body.replace("100000", "1");
  assert.throws(
    () => safepay.webhooks.constructEvent(tampered, sign(body), secret),
    (err) => err.type === "SafepaySignatureVerificationError"
  );
});

test("constructEvent throws on the wrong secret", () => {
  assert.throws(
    () => safepay.webhooks.constructEvent(body, sign(body, "other"), secret),
    (err) => err instanceof safepay.errors.SafepaySignatureVerificationError
  );
});

test("constructEvent throws a clear error when the header is missing", () => {
  assert.throws(
    () => safepay.webhooks.constructEvent(body, undefined, secret),
    /x-sfpy-signature/
  );
});

test("signature arrays from duplicated headers use the first value", () => {
  const event = safepay.webhooks.constructEvent(body, [sign(body), "junk"], secret);
  assert.equal(event.type, "payment.succeeded");
});

test("verifySignature accepts the previous secret during rotation", () => {
  const oldSig = sign(body, "old_secret");
  assert.equal(safepay.webhooks.verifySignature(body, oldSig, ["new_secret", "old_secret"]), true);
  assert.equal(safepay.webhooks.verifySignature(body, oldSig, ["new_secret"]), false);
});

test("a signature of a different length is rejected without throwing", () => {
  assert.equal(safepay.webhooks.verifySignature(body, "abc", secret), false);
});

test("constructEvent throws when no secret is given", () => {
  assert.throws(() => safepay.webhooks.constructEvent(body, sign(body), ""), /secret/);
});
