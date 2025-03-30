import { Prop } from "@nestjs/mongoose";
import { now } from "mongoose";

export class TimestampDocument {
  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}
