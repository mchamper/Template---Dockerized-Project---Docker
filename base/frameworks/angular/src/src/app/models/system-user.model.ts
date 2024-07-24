import { AbstractModel, TAuthModel, TAuthModelData } from "../core/models/abstract.model";
import moment, { Moment } from "moment";

export type TSystemUser = {
  id: number,
  firstName: string,
  lastName: string,
  fullName: string,
  email: string,
  emailVerifiedAt?: Moment,
  picture?: {
    originalUrl: string,
  },
  socialId: string,
  socialDriver: {
    id: number,
    name: string
  },
  socialAvatar: string,
  status: {
    id: number,
    name: string
  },
  rolesAndPermissions: {
    roles: string[],
    permissions: string[],
  },
  createdAt: Moment,
  updatedAt: Moment,
  deletedAt?: Moment,
}

export class SystemUser extends AbstractModel<TSystemUser, 'backend'> implements TAuthModel {

  isActive(): boolean {
    return this.data.status.id === 1;
  }

  /* -------------------- */

  protected _parsers() {
    return {
      'backend': (data: any): TSystemUser => {
        return {
          ...data,
          emailVerifiedAt: data.emailVerifiedAt ? moment(data.emailVerifiedAt) : null,
          createdAt: moment(data.createdAt),
          updatedAt: moment(data.updatedAt),
          deletedAt: data.deletedAt ? moment(data.deletedAt) : null,
        };
      }
    }
  };

  /* -------------------- */

  getAuthData(): TAuthModelData {
    return {
      id: this.data.id,
      name: this.data.fullName,
      firstName: this.data.firstName,
      lastName: this.data.lastName,
      email: this.data.email,
      isVerified: !!this.data.emailVerifiedAt,
      picture: this.data.picture?.originalUrl || this.data.socialAvatar,
      roles: this.data.rolesAndPermissions.roles,
      permissions: this.data.rolesAndPermissions.permissions,
      model: this,
    };
  }
}
