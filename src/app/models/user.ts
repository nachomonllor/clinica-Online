export interface Roles {
  patient?: boolean;
  profesional?: boolean;
  admin?: boolean;
}

export interface UserInterface {
  id?: string;
  name?: string;
  lastname?: string;
  email?: string;
  password?: string;
  photoUrl?: string;
  roles: Roles;
}
