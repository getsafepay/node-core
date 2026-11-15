declare module "@sfpy/node-core" {
  namespace Safepay {
    type WebhookPayload = string | Buffer | Record<string, unknown>;

    type WebhookEvent = {
      type?: string;
      data?: unknown;
      [key: string]: unknown;
    };

    class Webhooks {
      /** Header Safepay sends the signature in (lowercase, as Node.js exposes it). */
      SIGNATURE_HEADER: "x-sfpy-signature";

      /**
       * Verifies the x-sfpy-signature header against the raw request body and
       * returns the parsed event. Throws SafepaySignatureVerificationError on mismatch.
       * Pass an array of secrets to accept both old and new secrets during a rotation.
       */
      constructEvent(
        payload: WebhookPayload,
        signature: string | string[] | undefined,
        secret: string | string[]
      ): WebhookEvent;

      /** Returns true if the signature matches the payload for any of the secrets. */
      verifySignature(
        payload: WebhookPayload,
        signature: string | string[] | undefined,
        secret: string | string[]
      ): boolean;

      /** Hex HMAC-SHA512 of the payload, as sent in x-sfpy-signature. */
      computeSignature(payload: WebhookPayload, secret: string): string;
    }
  }
}
