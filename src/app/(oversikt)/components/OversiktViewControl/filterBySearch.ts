import type { RequirementsListItem } from "@/schemas/lineManagerRequirementsListSchema";

export function filterBySearch(
  requirements: RequirementsListItem[],
  query: string,
): RequirementsListItem[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return requirements;

  const fnrQuery = normalizedQuery.replace(/\s/g, "");

  return requirements.filter((r) => {
    const fullnavn = [r.name.firstName, r.name.middleName, r.name.lastName]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (fullnavn.includes(normalizedQuery)) return true;

    const fnrNormalisert = r.employeeIdentificationNumber.replace(/\s/g, "");
    return fnrNormalisert.includes(fnrQuery);
  });
}
