import { Router } from "express";
import { RepairController } from "./repair.controller";
import { RepairService } from "../services/repairs.service";

export class RepairRoutes {

    static get routes(): Router{

        const router = Router();

        const repairService = new RepairService();

        const repairController = new RepairController(repairService);

        router.get('/', repairController.findAllRepairs);
        router.post('/', repairController.createRepair);
        router.get('/:id', repairController.findRepairById);
        router.patch('/:id', repairController.updateRepairById);
        router.delete('/:id', repairController.deleteRepairById);

        return router;
    }



    




}