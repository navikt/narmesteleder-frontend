import { HttpResponse, http } from "msw";
import {
  getLineManagerPostPath,
  getLineManagerPutPath,
  getLineManagerRequirementPath,
} from "@/server/apiPaths";
import { mockLineManagerRequirement } from "./data/mockLineManagerRequirement";

export const handlers = [
  http.get(getLineManagerRequirementPath(":id"), ({ params }) => {
    return HttpResponse.json({
      ...mockLineManagerRequirement,
      id: params.id,
    });
  }),

  http.put(
    getLineManagerPutPath(":requirementId"),
    async ({ params, request }) => {
      const body = (await request.json()) as Record<string, unknown>;
      return HttpResponse.json(
        {
          ...body,
          id: params.requirementId,
        },
        { status: 202 },
      );
    },
  ),

  http.post(getLineManagerPostPath(), async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      {
        ...body,
      },
      { status: 202 },
    );
  }),
];
