import PersonTypes from '../person-types';

export class PersonCreateInput implements Partial<PersonTypes.Person> {
  login: string;
  password: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  phone?: string;
  email?: string;
  roles?: PersonTypes.Role;
}
