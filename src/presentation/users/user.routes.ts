import { Router } from "express";
import { UserController } from "./user.controller";
import { UserService } from "../services/user.service";
import { EmailService } from "../services/email.service";
import { envs } from "../../config/env";



export class UserRoutes {

    static get routes(): Router{

        const emailService = new EmailService(
            envs.MAILER_SERVICE,
            envs.MAILER_EMAIL,
            envs.MAILER_SECRET_KEY,
            envs.SEND_EMAIL
        )
         const userService = new UserService(emailService);          
         const userController = new UserController(userService);

         const router = Router();
         router.post('/', userController.createUser);
         router.get('/', userController.findAllUsers);
         router.get('/:id', userController.findUserById);
         
         router.patch('/:id',userController.updateUser);
         router.delete('/:id', userController.deleteUserById);

         router.post('/login', userController.login);
         router.get('/validate-email/:token', userController.validateEmail)

        return router

    }

}