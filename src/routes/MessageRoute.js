import express from "express"
import { getMessages, getUsersInSidebar, sendMessages } from "../controller/MessageController.js"
import { protected_route } from "../middleware/Protected.js"

const messegeRoute = express.Router()

messegeRoute.get("/user",protected_route,getUsersInSidebar)
messegeRoute.get("/:id",protected_route,getMessages)
messegeRoute.post("/send/:id",protected_route,sendMessages)





export default messegeRoute