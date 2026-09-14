import crypto from "crypto";

export function requestIdMiddleware(req, res, next) {
  const incoming = req.get("X-Request-ID");
  const requestId = incoming && incoming.length <= 128 ? incoming : crypto.randomUUID();
  req.requestId = requestId;
  res.setHeader("X-Request-ID", requestId);
  next();
}
