import { MenuElipsisVerticalIcon, PersonPlusIcon } from "@navikt/aksel-icons";
import { ActionMenu, BodyShort, Button, Table, VStack } from "@navikt/ds-react";
import { publicEnv } from "@/env-variables/publicEnv";
import type { RequirementsListItem } from "@/schemas/lineManagerRequirementsListSchema";
import { formatFnr, joinNonEmpty } from "@/utils/formatting";
import { UiSelector } from "@/utils/uiSelectors";
import { OversiktSpinner } from "../OversiktSpinner";

interface OversiktTabellProps {
  requirements: RequirementsListItem[];
  orgnr: string;
  loading?: boolean;
}

export const ADD_LINEMANAGER_LABEL = "Legg til nærmeste leder";

export function getAddLinemanagerHref(
  requirementId: string,
  orgnr: string,
): string {
  const returnTo = `/oversikt?orgnr=${orgnr}&tab=mangler-leder`;
  const params = new URLSearchParams({ returnTo });
  return `${publicEnv.NEXT_PUBLIC_BASE_PATH}/${requirementId}?${params}`;
}

function HandlingCell({
  requirement,
  orgnr,
}: {
  requirement: RequirementsListItem;
  orgnr: string;
}) {
  const fullName = joinNonEmpty([
    requirement.name.firstName,
    requirement.name.middleName,
    requirement.name.lastName,
  ]);
  const actionLabel = `Handlinger for ${fullName}`;

  return (
    <ActionMenu>
      <ActionMenu.Trigger>
        <Button
          aria-label={actionLabel}
          title={actionLabel}
          data-color="neutral"
          variant="tertiary"
          size="small"
          icon={<MenuElipsisVerticalIcon aria-hidden />}
        />
      </ActionMenu.Trigger>
      <ActionMenu.Content align="end">
        <ActionMenu.Item
          as="a"
          href={getAddLinemanagerHref(requirement.id, orgnr)}
          icon={<PersonPlusIcon aria-hidden />}
        >
          {ADD_LINEMANAGER_LABEL}
        </ActionMenu.Item>
      </ActionMenu.Content>
    </ActionMenu>
  );
}

export function OversiktTabell({
  requirements,
  orgnr,
  loading,
}: OversiktTabellProps) {
  if (loading) {
    return <OversiktSpinner />;
  }

  if (requirements.length === 0) {
    return (
      <VStack
        align="center"
        gap="space-12"
        paddingBlock="space-40"
        data-testid={UiSelector.OversiktTomState}
      >
        <BodyShort>Ingen ansatte å vise her.</BodyShort>
      </VStack>
    );
  }

  return (
    <Table zebraStripes data-testid={UiSelector.OversiktTabell}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell scope="col">Ansatt</Table.HeaderCell>
          <Table.HeaderCell scope="col">Nærmeste leder</Table.HeaderCell>
          <Table.HeaderCell scope="col">Handling</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {requirements.map((req) => {
          const fullnavn = joinNonEmpty([
            req.name.firstName,
            req.name.middleName,
            req.name.lastName,
          ]);

          return (
            <Table.Row key={req.id}>
              <Table.HeaderCell scope="row">
                <VStack gap="space-4">
                  <BodyShort>{fullnavn}</BodyShort>
                  <BodyShort size="small">
                    {formatFnr(req.employeeIdentificationNumber)}
                  </BodyShort>
                </VStack>
              </Table.HeaderCell>
              <Table.DataCell>Ikke registrert</Table.DataCell>
              <Table.DataCell>
                <HandlingCell requirement={req} orgnr={orgnr} />
              </Table.DataCell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}
