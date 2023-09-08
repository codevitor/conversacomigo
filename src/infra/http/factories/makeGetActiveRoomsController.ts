import { Controller } from "@core/logic/Controller"
import { GetActiveRooms } from "@modules/http/GetActiveRooms/routes/GetActiveRooms"
import { GetActiveRoomsController } from "@modules/http/GetActiveRooms/routes/GetActiveRoomsController"

export function makeGetActiveRoomsController(): Controller {
  const useCase = new GetActiveRooms()
  const controller = new GetActiveRoomsController(useCase)

  return controller
}