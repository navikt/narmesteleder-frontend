import { HttpResponse, http } from "msw";
import { getLineManagerRequirementPath } from "@/server/apiPaths";
import { mockLineManagerRequirement } from "./data/mockLineManagerRequirement";

export const handlers = [
  http.get(getLineManagerRequirementPath(":id"), ({ params }) => {
    return HttpResponse.json({
      ...mockLineManagerRequirement,
      id: params.id,
    });
  }),
];
