import { Controller } from "@core/logic/Controller"
import { PrismaUserRoomRepository } from "@modules/http/Admin/repositories/prisma/PrismaUserRoomRepository"
import { BanUser } from "@modules/http/Admin/useCases/BanUser/BanUser"
import { BanUserController } from "@modules/http/Admin/useCases/BanUser/BanUserController"

export function makeBanUserController(): Controller {
  const repository = new PrismaUserRoomRepository();
  const useCase = new BanUser(repository)
  const controller = new BanUserController(useCase)

  return controller
}