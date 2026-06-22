import { BodyShort, Button, Table, VStack } from "@navikt/ds-react";
import { publicEnv } from "@/env-variables/publicEnv";
import type { RequirementsListItem } from "@/schemas/lineManagerRequirementsListSchema";
import { formatFnr, joinNonEmpty } from "@/utils/formatting";
import { UiSelector } from "@/utils/uiSelectors";

interface OversiktTabellProps {
  requirements: RequirementsListItem[];
}

function HandlingCell({ requirement }: { requirement: RequirementsListItem }) {
  const behovUrl = `${publicEnv.NEXT_PUBLIC_BASE_PATH}/${requirement.id}`;
  const label = "Oppgi leder";

  return (
    <Button
      as="a"
      href={behovUrl}
      variant="primary"
      size="small"
      aria-label={`${label} for ${joinNonEmpty([requirement.name.firstName, requirement.name.middleName, requirement.name.lastName])}`}
    >
      {label}
    </Button>
  );
}

export function OversiktTabell({ requirements }: OversiktTabellProps) {
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
          <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
          <Table.HeaderCell scope="col">Fødselsnummer</Table.HeaderCell>
          <Table.HeaderCell scope="col">
            <span className="sr-only">Handlinger</span>
          </Table.HeaderCell>
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
              <Table.HeaderCell scope="row">{fullnavn}</Table.HeaderCell>
              <Table.DataCell>
                {formatFnr(req.employeeIdentificationNumber)}
              </Table.DataCell>
              <Table.DataCell>
                <HandlingCell requirement={req} />
              </Table.DataCell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}
