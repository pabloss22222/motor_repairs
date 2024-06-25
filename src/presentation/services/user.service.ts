import { User } from "../../data";
import { CustomError } from "../../domain/errors/custom.errors";

enum UserRole {
    CLIENT= 'CLIENT',
    EMPLOYEE= 'EMPLOYEE'
}
enum UserStatus {
    AVAILABLE ='AVAILABLE',
    DISABLED = 'DISABLED'
}

export class UserService{

    constructor(){}

    async createUser(userData: any){

        // const EmailExist = await this.validateIfEmailExist(userData.email)

        // if(EmailExist){
        //     return "The email already exists!"
        // }
        const user = new User();

        user.name = userData.name.toLowerCase().trim();
        user.email= userData.email.toLowerCase().trim();
        user.password = userData.password.trim();
        user.role = UserRole.CLIENT;

        try{
            return await user.save();

        }catch(error: any){
            throw CustomError.internalServer("Something went very wrong! ❌")
        }

    }
    async findAllUsers(){
        try{
            return await User.find({
                where: {
                    status: UserStatus.AVAILABLE
                }
            });
        }catch(error: any){
            throw CustomError.internalServer("Something went very wrong! ❌")
        }
    }
    async findUserById(id: number){
        const user = await User.findOne({
            where: {
                id: id,
                status: UserStatus.AVAILABLE
            }
        })
        if(!user){
            throw CustomError.notFound(`user with id:${id} not found`);
        }
        return user;

    }
    async updateUserById(userData: any, id: number){

        const user= await this.findUserById(id);

        user.name= userData.name;
        user.email= userData.email;
        user.password= userData.password;

        try{
            return await user.save();
        }catch(error: any){
            throw CustomError.internalServer("Something went very wrong! ❌")
        }
    }
    async deleteUserById(id:number){
        const user= await this.findUserById(id);

        user.status= UserStatus.DISABLED;
        try{
            await user.save();

        }catch(error: any){
            throw CustomError.internalServer("Something went very wrong! ❌")
        }
    }
    async validateIfEmailExist(email: string){
        const user = await User.find({
             where: {
                email: email,
            }
        })
        // if(!user){
        //      return false;
        // }
        return user;
    }
}