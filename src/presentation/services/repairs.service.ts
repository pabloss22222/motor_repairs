import { Repair } from "../../data"
import { CreateRepairDto } from "../../domain";
import { CustomError } from "../../domain/errors/custom.errors";
import { UserService } from "./user.service";


enum RepairStatus {
    PENDING='PENDING',
    COMPLETED='COMPLETED',
    CANCELLED='CANCELED',
}

export class RepairService{

    constructor(private readonly userService: UserService){}

    async createRepair(createRepairData:CreateRepairDto, userId:number){

        const userPromise =  this.userService.findUserById(userId); 
   
        const userData = await userPromise

        const repair = new Repair;
        repair.date=createRepairData.date;
        repair.status=RepairStatus.PENDING
        repair.user=userData;
        try{
            return await repair.save();

        }catch(error: any){
            throw CustomError.internalServer("Something went very wrong! ❌")
        }
    }
    async findAllRepairs(){
        try{
            return await Repair.find({
                where: {
                    status: RepairStatus.PENDING,
                }
            });
        }catch(error: any){
            throw CustomError.internalServer("Something went very wrong! ❌")
        }
    }
    async findRepairById(id: number){
        const repair = await Repair.findOne({
            where: {
                id: id,
                status: RepairStatus.PENDING,
            }
        })
        if(!repair){
            throw CustomError.notFound(`repair with id:${id} not found`);
        }
        return repair;

    }
    async updateRepairById(id: number){

        const repair= await this.findRepairById(id);

        repair.status=RepairStatus.COMPLETED;

        try{
            return await repair.save();
        }catch(error: any){
            throw CustomError.internalServer("Something went very wrong! ❌")
        }
    }
    async deleteRepairById(id:number){
        const repair= await this.findRepairById(id);

        repair.status= RepairStatus.CANCELLED;
        try{
            await repair.save();

        }catch(error: any){
            throw CustomError.internalServer("Something went very wrong! ❌")
        }
    }

}