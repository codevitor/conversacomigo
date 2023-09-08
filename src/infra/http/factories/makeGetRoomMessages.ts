import { Controller } from "@core/logic/Controller";
import { GetRoomMessages } from "@modules/http/Admin/useCases/GetRoomMessages/GetRoomMessages";
import { GetRoomMessagesController } from "@modules/http/Admin/useCases/GetRoomMessages/GetRoomMessagesController";

export function makeGetRoomMessages(): Controller {
  const useCase = new GetRoomMessages();
  const controller = new GetRoomMessagesController(useCase);

  return controller;
}
