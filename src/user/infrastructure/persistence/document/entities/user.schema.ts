import { AuthProvidersEnum } from '@/auth/auth-providers.enum';
import { RoleEnum } from '@/role/role.enum';
import { UserStatusEnum } from '@/user/user-status.enum';
import { EntityDocumentHelper } from '@/utils/entity-document-helper';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now } from 'mongoose';

export type UserSchemaDocument = HydratedDocument<UserSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class UserSchemaClass extends EntityDocumentHelper {
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

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop({ default: now })
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserSchemaClass);
