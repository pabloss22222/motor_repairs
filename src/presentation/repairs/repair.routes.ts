import { Router } from "express";
import { RepairController } from "./repair.controller";
import { RepairService } from "../services/repairs.service";
import { AuthMiddleware } from "../middelware/auth.middelware";

export class RepairRoutes {

    static get routes(): Router{

        const router = Router();

        const repairService = new RepairService();

        const repairController = new RepairController(repairService);

        router.post('/', repairController.createRepair);
        router.use(AuthMiddleware.protect, AuthMiddleware.restrictTo)
        router.get('/', repairController.findAllRepairs);
        router.get('/:id', repairController.findRepairById);
        router.patch('/:id', repairController.updateRepairById);
        router.delete('/:id', repairController.deleteRepairById);

        return router;
    }



    




}