import { DomainError } from '@core/logic/domain/DomainError'

export class RoomNotFound extends Error implements DomainError {
  constructor() {
    super(`ROOM NOT FOUND`)
    this.name = 'RoomNotFound'
  }
}