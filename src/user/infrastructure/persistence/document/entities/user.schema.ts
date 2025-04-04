import { AuthProvidersEnum } from '@/auth/auth-providers.enum';
import { SoftDeleteDocumentHelper } from '@/helpers/entities';
import { RoleEnum } from '@/role/role.enum';
import { UserStatusEnum } from '@/user/user-status.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserSchemaDocument = HydratedDocument<UserSchemaClass>;

@Schema({
  collection: 'Users',
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class UserSchemaClass extends SoftDeleteDocumentHelper {
  @Prop({
    type: String,
    unique: true,
  })
  email: string;

  @Prop()
  password?: string;

  @Prop({
    default: AuthProvidersEnum.email,
  })
  provider: string;

  @Prop({
    type: String,
    default: null,
  })
  socialId?: string;

  @Prop({
    type: String,
  })
  firstName: string | null;

  @Prop({
    type: String,
  })
  lastName: string | null;

  @Prop({
    type: String,
  })
  photo?: string | null;

  @Prop({
    type: Number,
    default: RoleEnum.user,
  })
  role?: number;

  @Prop({
    type: Number,
    default: UserStatusEnum.inactive,
  })
  status?: number;
}

export const USER_DOCUMENT_NAME = 'User';
export const UserSchema = SchemaFactory.createForClass(UserSchemaClass);
