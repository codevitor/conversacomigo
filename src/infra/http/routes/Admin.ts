import { adaptRoute } from "@core/logic/adapters/ExpressRouteAdapter";
import express from "express";
import { makeAuthenticateController } from "../factories/makeAuthenticateController";
import { adaptMiddleware } from "@core/logic/adapters/ExpressMiddlewareAdapter";
import { makeAuthenticationMiddleware } from "../factories/middlewares/makeAuthenticationMiddleware";
import { makeGetActiveRoomsController } from "../factories/makeGetActiveRoomsController";
import { makeGetRoomMessages } from "../factories/makeGetRoomMessages";



const Admin = express.Router()


Admin.get("/auth", adaptRoute(makeAuthenticateController()));
Admin.get("/rooms", adaptMiddleware(makeAuthenticationMiddleware()), adaptRoute(makeGetActiveRoomsController()))
Admin.get("/rooms/:roomId/messages",adaptMiddleware(makeAuthenticationMiddleware()), adaptRoute(makeGetRoomMessages()))

export { Admin };