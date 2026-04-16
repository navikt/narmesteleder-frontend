export const validTestData = {
  fnr: "12345678901",
  orgnummer: "963890095",
  email: "test@example.com",
  mobilnummer: "12345678",
  etternavn: "Testersen",
  virksomhetHovedenhetNavn: "Havna Holding AS",
  virksomhetNavn: "Shark AS",
  virksomhetSoketekst: "Shark",
  requirementId: "550e8400-e29b-41d4-a716-446655440000",
};

export const invalidTestData = {
  fnr: "1234567890",
  orgnummer: "12345678",
  email: "test@example",
  mobilnummer: "1234567",
  etternavn: "",
  virksomhetSoketekst: "Shark",
  requirementId: "invalid-guid",
};
