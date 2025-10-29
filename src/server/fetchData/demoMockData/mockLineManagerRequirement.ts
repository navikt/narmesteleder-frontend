import { LineManagerReadResponse } from '@/schemas/lineManagerReadSchema'

export const mockLineManagerRequirement: LineManagerReadResponse = {
  id: '123456',
  employeeIdentificationNumber: '26095514420',
  orgnumber: '963890095',
  mainOrgnumber: '123456789',
  managerIdentificationNumber: '19048938755',
  name: {
    firstName: 'John',
    lastName: 'Doe',
    middleName: 'Muller',
  },
}
