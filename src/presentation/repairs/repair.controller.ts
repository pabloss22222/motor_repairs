import { CreateRepairDto } from "../../domain";
import { CustomError } from "../../domain/errors/custom.errors";
import { RepairService } from "../services/repairs.service";
import { Request, Response } from "express";

export class RepairController{ 

    constructor(public repairService: RepairService){}

    private handleError=(error: unknown, res: Response)=>{
        console.log(error)
        if(error instanceof CustomError){
           return res.status(error.statusCode).json({message: error.message})
        }
        return res.status(500).json({message:"Something went very wrong! ❌" })
      }
  
      createRepair=(req: Request, res: Response)=>{
  
         const [ error, createRepairDTO ] = CreateRepairDto.create(req.body);
         if( error ) return res.status(422).json({ message: error })

         const sessionUserId = req.body.sessionUser.id;
  
          this.repairService.createRepair(createRepairDTO!, sessionUserId)
           .then(repair => res.status(201).json(repair))
           .catch((error:any)=>{this.handleError(error, res)})
      }
  
      findAllRepairs=(_req: Request, res: Response)=>{
  
        this.repairService.findAllRepairs()
           .then(repairs => res.status(200).json(repairs))
           .catch((error:any)=>{console.log(error)})
      }
  
      findRepairById=(req: Request, res: Response)=>{
        const {id}=req.params;
  
        if(isNaN(+id)){
           return res.status(400).json({ message: 'the id have to be a number' })
        }
        this.repairService.findRepairById(+id)
            .then(repair => res.status(200).json(repair))
            .catch((error:any)=>{this.handleError(error, res)})
      }
  
      updateRepairById=(req: Request, res: Response)=>{
          const {id}=req.params;
          this.repairService.updateRepairById(+id)
            .then(repair=>{res.status(200).json(repair)})
            .catch((error:any)=>{this.handleError(error, res)})
      }
  
      deleteRepairById=(req: Request, res: Response)=>{
        const {id} = req.params;
        if(isNaN(+id)){
           return res.status(400).json({ message: 'the id have to be a number' })
        }
        this.repairService.deleteRepairById(+id)
          .then(() => res.status(204).json())
          .catch((error:any)=>{this.handleError(error, res)})
      }
    
}