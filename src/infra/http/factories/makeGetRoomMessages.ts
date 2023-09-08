import { Controller } from "@core/logic/Controller"
import { GetRoomMessages } from "@modules/http/GetRoomMessages/GetRoomMessages"
import { GetRoomMessagesController } from "@modules/http/GetRoomMessages/GetRoomMessagesController"

export function makeGetRoomMessages(): Controller {
  const useCase = new GetRoomMessages()
  const controller = new GetRoomMessagesController(useCase)

  return controller
}