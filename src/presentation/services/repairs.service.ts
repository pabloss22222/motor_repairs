import { Repair } from "../../data"
import { CustomError } from "../../domain/errors/custom.errors";


enum RepairStatus {
    PENDING='PENDING',
    COMPLETED='COMPLETED',
    CANCELLED='CANCELED',
}

export class RepairService{

    constructor(){}

    async createRepair(repairData:any){
        const repair = new Repair;
        repair.date=repairData.date;
        repair.status=RepairStatus.PENDING
        repair.userId=repairData.userId;
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