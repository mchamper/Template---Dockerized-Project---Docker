import { Moment } from "moment";
import { AbstractModel } from "./abstract-model";
import { IAuth } from "../services/auth.service";
import * as moment from "moment";

export interface ISystemUser {
  id: number,
  firstName: string,
  lastName: string,
  fullName: string,
  email: string,
  emailVerifiedAt: Moment | null,
  picture: string,
  socialId: string,
  socialDriver: 'Google' | 'Facebook',
  socialAvatar: string,
  status: 'Active' | 'Inactive',
  statusEnum: {
    color: string,
    label: string
  },
  rolesAndPermissions: {
    roles: string[],
    permissions: string[],
  },
  createdAt: Moment,
  updatedAt: Moment | null,
  deletedAt: Moment | null,
}

export class SystemUser extends AbstractModel<ISystemUser> {

  /* -------------------- */

  getParsedFromBackend(data: any): ISystemUser {
    return {
      ...data,
      emailVerifiedAt: data.emailVerifiedAt ? moment(data.emailVerifiedAt) : null,
      createdAt: moment(data.createdAt),
      updatedAt: data.updatedAt ? moment(data.updatedAt) : null,
      deletedAt: data.deletedAt ? moment(data.deletedAt) : null,
    };
  }

  /* -------------------- */

  getParsedForAuthData(): IAuth['data'] {
    return {
      id: this.data.id,
      email: this.data.email,
      name: this.data.fullName,
      isVerified: !!this.data.emailVerifiedAt,
      firstName: this.data.firstName,
      lastName: this.data.lastName,
      picture: this.data.picture,
      roles: this.data.rolesAndPermissions.roles,
      permissions: this.data.rolesAndPermissions.permissions,
      _raw: this,
    };
  }
}
