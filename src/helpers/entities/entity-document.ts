import { Transform } from 'class-transformer';
import { TimestampDocument } from './timestamp-document';

export class EntityDocumentHelper extends TimestampDocument {
  @Transform(
    (value) => {
      if ('value' in value) {
        // https://github.com/typestack/class-transformer/issues/879
        return value.obj[value.key].toString();
      }

      return 'unknown value';
    },
    {
      toPlainOnly: true,
    },
  )
  public _id: string;
}
