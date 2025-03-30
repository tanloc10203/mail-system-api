import { Prop } from '@nestjs/mongoose';
import { EntityDocumentHelper } from './entity-document';

export class SoftDeleteDocumentHelper extends EntityDocumentHelper {
  @Prop({ default: null })
  deletedAt: Date;
}
