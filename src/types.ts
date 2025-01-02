import type { RequestHandler } from "express";

export type Handler = (
  ...args: Parameters<RequestHandler>
) => string | object | number;
