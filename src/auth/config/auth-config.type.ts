import ms from "ms";

export type AuthConfig = {
  refreshExpiresIn: ms.StringValue;
  accessExpiresIn: ms.StringValue;
  confirmEmailExpiresIn: ms.StringValue;
  resetPasswordExpiresIn: ms.StringValue;
  configEmailSecure: string;
}