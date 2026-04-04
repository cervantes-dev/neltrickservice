export const successResponse = (data: unknown, meta?: object, status = 200) =>
  Response.json({ success: true, data, ...meta }, { status });

export const errorResponse = (message: string, status = 500) =>
  Response.json({ success: false, message }, { status });