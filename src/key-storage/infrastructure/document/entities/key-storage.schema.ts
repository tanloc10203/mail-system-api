import { EntityDocumentHelper } from '@/helpers/entities';
import { UserSchemaClass } from '@/user/infrastructure/persistence';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type KeyStorageSchemaDocument = HydratedDocument<KeyStorageSchemaClass>;

@Schema({
  collection: 'KeyStorages',
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class KeyStorageSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: String,
    unique: true,
  })
  publicKey: string;

  @Prop({
    type: String,
    unique: true,
  })
  privateKey: string;

  @Prop({
    type: String,
    unique: true,
  })
  jit: string;

  @Prop({
    type: String,
  })
  refreshToken: string;

  @Prop({
    type: [String],
    default: [],
  })
  refreshTokensUsed: string[];

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: UserSchemaClass;

  @Prop()
  deviceName?: string;

  @Prop()
  deviceType?: string;

  @Prop()
  operatingSystem?: string;

  @Prop()
  browser?: string;

  @Prop()
  ipAddress?: string;

  @Prop()
  location?: string;

  @Prop()
  lastLogin?: Date;
}

export const KEY_STORAGE_DOCUMENT_NAME = 'KeyStorage';
export const KeyStorageSchema = SchemaFactory.createForClass(KeyStorageSchemaClass);
