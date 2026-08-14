"use server";

import type { LineManagerRevokeRequest } from "@/schemas/lineManagerRevokeSchema";
import { revokeLinemanager } from "@/server/actions/revokeLinemanager";

export async function revokeLinemanagerAction(
  payload: LineManagerRevokeRequest,
) {
  return revokeLinemanager(payload);
}
