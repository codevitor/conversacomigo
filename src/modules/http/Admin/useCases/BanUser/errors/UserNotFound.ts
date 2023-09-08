import { DomainError } from "@core/logic/domain/DomainError";

export class UserNotFound extends Error implements DomainError {
  constructor() {
    super(`USER NOT FOUND`);
    this.name = "UserNotFound";
  }
}
