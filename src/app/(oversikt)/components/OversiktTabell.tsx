import { ExclamationmarkTriangleIcon } from "@navikt/aksel-icons";
import {
  BodyShort,
  Button,
  HStack,
  Table,
  Tag,
  VStack,
} from "@navikt/ds-react";
import { publicEnv } from "@/env-variables/publicEnv";
import type { RequirementsListItem } from "@/schemas/lineManagerRequirementsListSchema";
import { formatFnr, joinNonEmpty } from "@/utils/formatting";
import { UiSelector } from "@/utils/uiSelectors";

interface OversiktTabellProps {
  requirements: RequirementsListItem[];
}

function buildBehovUrl(id: string): string {
  return `${publicEnv.NEXT_PUBLIC_BASE_PATH}/${id}`;
}

function LederCell({
  managerIdentificationNumber,
}: {
  managerIdentificationNumber: string | null;
}) {
  if (!managerIdentificationNumber) {
    return (
      <HStack gap="space-4" align="center" wrap={false}>
        <ExclamationmarkTriangleIcon aria-hidden fontSize="1.25rem" />
        <Tag variant="warning" size="small">
          Ingen leder
        </Tag>
      </HStack>
    );
  }

  return <BodyShort>{formatFnr(managerIdentificationNumber)}</BodyShort>;
}

function HandlingCell({ requirement }: { requirement: RequirementsListItem }) {
  const behovUrl = buildBehovUrl(requirement.id);
  const harLeder = requirement.managerIdentificationNumber !== null;
  const label = harLeder ? "Endre leder" : "Oppgi leder";

  return (
    <Button
      as="a"
      href={behovUrl}
      variant={harLeder ? "secondary" : "primary"}
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
          <Table.HeaderCell scope="col">Nærmeste leder</Table.HeaderCell>
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
                <LederCell
                  managerIdentificationNumber={req.managerIdentificationNumber}
                />
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
