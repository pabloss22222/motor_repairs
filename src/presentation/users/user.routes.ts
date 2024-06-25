import { Router } from "express";
import { UserController } from "./user.controller";
import { UserService } from "../services/user.service";



export class UserRoutes {

    static get routes(): Router{

         const userservice = new UserService();          
         const usercontroller = new UserController(userservice);

         const router = Router();
         router.post('/', usercontroller.createUser);
         router.get('/', usercontroller.findAllUsers);
         router.get('/:id', usercontroller.findUserById);
         router.patch('/:id',usercontroller.updateUser);
         router.delete('/:id', usercontroller.deleteUserById);

        return router

    }

}