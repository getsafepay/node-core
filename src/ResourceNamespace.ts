// ResourceNamespace allows you to create nested resources, i.e. `safepay.issuing.cards`.
// It also works recursively, so you could do i.e. `safepay.billing.invoicing.pay`.

import { SafepayObject, SafepayResourceObject } from "./types.js";

export type SafepayResourceNamespaceObject = {
  [key: string]: SafepayResourceObject | SafepayResourceNamespaceObject;
};

function ResourceNamespace(
  this: SafepayResourceNamespaceObject,
  safepay: SafepayObject,
  resources: Record<
    string,
    new (
      ...args: any[]
    ) => SafepayResourceObject | SafepayResourceNamespaceObject
  >
): void {
  for (const name in resources) {
    const camelCaseName = name[0].toLowerCase() + name.substring(1);

    const resource = new resources[name](safepay);

    this[camelCaseName] = resource;
  }
}

export function resourceNamespace(
  namespace: string,
  resources: Record<
    string,
    new (
      ...args: any[]
    ) => SafepayResourceObject | SafepayResourceNamespaceObject
  >
): new (safepay: SafepayObject) => SafepayResourceNamespaceObject {
  return function (safepay: SafepayObject): SafepayResourceNamespaceObject {
    return new (ResourceNamespace as any)(safepay, resources);
  } as any;
}
