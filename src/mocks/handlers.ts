import { HttpResponse, http } from "msw";
import {
  lineManagerRequestSchema,
  managerRequestSchema,
} from "@/schemas/lineManagerRequestSchema";
import {
  getLineManagerPostPath,
  getLineManagerPutPath,
  getLineManagerRequirementPath,
} from "@/server/apiPaths";
import { mockLineManagerRequirement } from "./data/mockLineManagerRequirement";

export const handlers = [
  http.get(getLineManagerRequirementPath(":id"), ({ params }) => {
    const id = params.id as string;
    const response = { ...mockLineManagerRequirement, id };

    console.info("[MSW][GET] line manager requirement", { id });

    return HttpResponse.json(response, { status: 200 });
  }),

  http.put(
    getLineManagerPutPath(":requirementId"),
    async ({ params, request }) => {
      try {
        const raw = await request.json();
        const parsed = managerRequestSchema.safeParse(raw);

        if (!parsed.success) {
          console.error("[MSW][PUT] validation failed", {
            requirementId: params.requirementId,
            issues: parsed.error.issues,
            payload: raw,
          });

          return HttpResponse.json(
            {
              error: "Validation failed",
              issues: parsed.error.issues,
              received: raw,
            },
            { status: 400 },
          );
        }

        const response = { ...parsed.data, id: params.requirementId };

        console.info("[MSW][PUT] updated line manager requirement", {
          requirementId: params.requirementId,
        });

        return HttpResponse.json(response, { status: 202 });
      } catch (error) {
        console.error("[MSW][PUT] invalid JSON", {
          requirementId: params.requirementId,
          error,
        });

        return HttpResponse.json({ error: "Invalid JSON" }, { status: 400 });
      }
    },
  ),

  http.post(getLineManagerPostPath(), async ({ request }) => {
    try {
      const raw = await request.json();
      const parsed = lineManagerRequestSchema.safeParse(raw);

      if (!parsed.success) {
        console.error("[MSW][POST] validation failed", {
          issues: parsed.error.issues,
          payload: raw,
        });

        return HttpResponse.json(
          {
            error: "Validation failed",
            issues: parsed.error.issues,
            received: raw,
          },
          { status: 400 },
        );
      }

      const response = { ...parsed.data, id: "mock-id" };

      console.info("[MSW][POST] created line manager requirement", {
        id: "mock-id",
      });

      return HttpResponse.json(response, { status: 201 });
    } catch (error) {
      console.error("[MSW][POST] invalid JSON", { error });

      return HttpResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
  }),
];
