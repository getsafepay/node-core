import * as crypto from "crypto";
import { SafepaySignatureVerificationError } from "./Error.js";

/**
 * Name of the header Safepay uses to send the webhook signature.
 * Node.js lowercases incoming header names, so read it as
 * `req.headers[SIGNATURE_HEADER]`.
 */
export const SIGNATURE_HEADER = "x-sfpy-signature";

export type WebhookPayload = string | Buffer | Record<string, unknown>;

export type SafepayWebhookEvent = {
  type?: string;
  data?: unknown;
  [key: string]: unknown;
};

const toBuffer = (payload: WebhookPayload): Buffer => {
  if (Buffer.isBuffer(payload)) return payload;
  if (typeof payload === "string") return Buffer.from(payload, "utf8");
  if (payload && typeof payload === "object") {
    // Fallback for frameworks that already parsed the body. Prefer passing the
    // raw body (e.g. express.raw()) so the bytes match exactly what was signed.
    return Buffer.from(JSON.stringify(payload), "utf8");
  }
  throw new SafepaySignatureVerificationError({
    message:
      "Webhook payload must be the raw request body (string or Buffer) or the parsed JSON object.",
  });
};

const normaliseHeader = (header: string | string[] | undefined): string => {
  const value = Array.isArray(header) ? header[0] : header;
  if (!value || typeof value !== "string") {
    throw new SafepaySignatureVerificationError({
      message: `No webhook signature found. Pass the value of the '${SIGNATURE_HEADER}' header.`,
    });
  }
  return value.trim().toLowerCase();
};

/**
 * Computes the hex HMAC-SHA512 signature Safepay sends in `x-sfpy-signature`.
 */
export const computeSignature = (payload: WebhookPayload, secret: string): string =>
  crypto.createHmac("sha512", secret).update(toBuffer(payload)).digest("hex");

const safeEqualHex = (a: string, b: string): boolean => {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
};

/**
 * Returns true if `signature` matches the payload for any of the given secrets.
 * Accepts several secrets so merchants can keep accepting webhooks signed with
 * their previous shared secret while a rotation propagates.
 */
export const verifySignature = (
  payload: WebhookPayload,
  signature: string | string[] | undefined,
  secret: string | string[]
): boolean => {
  const received = normaliseHeader(signature);
  const secrets = (Array.isArray(secret) ? secret : [secret]).filter(Boolean);
  if (secrets.length === 0) {
    throw new SafepaySignatureVerificationError({
      message: "No webhook secret provided. Copy it from Developers > Endpoints in your Safepay dashboard.",
    });
  }
  return secrets.some((s) => safeEqualHex(computeSignature(payload, s), received));
};

/**
 * Verifies a webhook's `x-sfpy-signature` and returns the parsed event.
 * Throws SafepaySignatureVerificationError when the signature does not match.
 *
 * @example
 * app.post("/webhooks/safepay", express.raw({ type: "application/json" }), (req, res) => {
 *   const event = safepay.webhooks.constructEvent(req.body, req.headers["x-sfpy-signature"], secret);
 * });
 */
export const constructEvent = (
  payload: WebhookPayload,
  signature: string | string[] | undefined,
  secret: string | string[]
): SafepayWebhookEvent => {
  if (!verifySignature(payload, signature, secret)) {
    throw new SafepaySignatureVerificationError({
      message:
        "Webhook signature does not match the payload. Make sure you pass the raw request body and the shared secret for this endpoint.",
    });
  }
  if (Buffer.isBuffer(payload) || typeof payload === "string") {
    try {
      return JSON.parse(payload.toString()) as SafepayWebhookEvent;
    } catch {
      throw new SafepaySignatureVerificationError({
        message: "Webhook signature is valid but the payload is not valid JSON.",
      });
    }
  }
  return payload as SafepayWebhookEvent;
};

export function createWebhooks(): {
  constructEvent: typeof constructEvent;
  verifySignature: typeof verifySignature;
  computeSignature: typeof computeSignature;
  SIGNATURE_HEADER: string;
} {
  return { constructEvent, verifySignature, computeSignature, SIGNATURE_HEADER };
}
