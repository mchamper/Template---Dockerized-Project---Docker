
import { Moment } from "moment";
import { BaseModel } from "./base-model";
import * as moment from "moment";
import { IAuth } from "src/app/services/auth.service";

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

export class SystemUser extends BaseModel<ISystemUser> {

  /* -------------------- */

  hasRole(roles: string | string[], matchAll: boolean = true): boolean {
    if (!isArray(roles)) roles = [roles];
    return roles[matchAll ? 'every' : 'some'](role => this.data.rolesAndPermissions.roles.includes(role));
  }

  can(permissions: string | string[], matchAll: boolean = true): boolean {
    if (!isArray(permissions)) permissions = [permissions];
    return permissions[matchAll ? 'every' : 'some'](permission => this.data.rolesAndPermissions.permissions?.includes(permission));
  }

  /* -------------------- */

  parseFromBackend(data: any): ISystemUser {
    return {
      ...data,
      emailVerifiedAt: data.emailVerifiedAt ? moment(data.emailVerifiedAt) : null,
      createdAt: moment(data.createdAt),
      updatedAt: data.updatedAt ? moment(data.updatedAt) : null,
      deletedAt: data.deletedAt ? moment(data.deletedAt) : null,
    };
  }

  /* -------------------- */

  parseForAuthData(): IAuth['data'] {
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
      model: this,
    };
  }
}
