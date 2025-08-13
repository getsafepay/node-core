declare module "@sfpy/node-core" {
  namespace Safepay {
    namespace Client {
      class Discounts {
        create(params?: any, options?: any): Promise<any>;
        find(params?: any, options?: any): Promise<any>;
        archive(params?: any, options?: any): Promise<any>;
        update(params?: any, options?: any): Promise<any>;
        list(params?: any, options?: any): Promise<any>;
        appliedList(params?: any, options?: any): Promise<any>;
      }
    }
  }
}
