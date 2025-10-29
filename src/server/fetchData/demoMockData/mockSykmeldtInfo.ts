import { SykmeldtInfoResponse } from '@/schemas/sykmeldtInfoSchema'

export const mockSykmeldtInfo: SykmeldtInfoResponse = {
  id: '123456',
  sykmeldtFnr: '26095514420',
  orgnummer: '963890095',
  hovedenhetOrgnummer: '123456789',
  narmesteLederFnr: '19048938755',
  name: {
    firstName: 'John',
    lastName: 'Doe',
    middleName: 'Muller',
  },
}
