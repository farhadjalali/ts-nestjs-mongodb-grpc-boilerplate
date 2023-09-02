import * as grpc from "@grpc/grpc-js";
import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
import { logger } from "../utils";

export function wrapHandler(methodName: string, handler) {
  return async (
    call: ServerUnaryCall<unknown, unknown>,
    callback: sendUnaryData<unknown>,
  ) => {
    try {
      logger.debug(`[${methodName}]`, JSON.stringify(call.request));
      await handler(call, callback);
      logger.debug(`[${methodName}] response sent!`);
    } catch (err) {
      logger.error("gRPC error:", err);
      const message =
        "message" in err ? err.message : "An internal error occurred";
      callback({
        code: grpc.status.INTERNAL,
        details: message,
      });
    }
  };
}
