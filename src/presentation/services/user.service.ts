import { bcryptAdapter } from "../../config/bcrypt.adapter";
import { envs } from "../../config/env";
import { JwtAdapter } from "../../config/jwt.adapter";
import { User } from "../../data";
import { CreateUserDto, LoginUserDTO } from "../../domain";
import { CustomError } from "../../domain/errors/custom.errors";
import { EmailService } from "./email.service";

enum UserRole {
    CLIENT= 'CLIENT',
    EMPLOYEE= 'EMPLOYEE'
}
enum UserStatus {
    AVAILABLE ='AVAILABLE',
    DISABLED = 'DISABLED'
}

export class UserService{

    constructor(private readonly emailService: EmailService){}

    async createUser(createUserDto: CreateUserDto){

        const existUser = await User.findOne({
            where: {
              email: createUserDto.email,
              status: UserStatus.AVAILABLE
            }
          })
      
          if( existUser ) throw CustomError.badRequest('Email already exist')
      
        const user = new User();

        user.name = createUserDto.name.toLowerCase().trim();
        user.email= createUserDto.email.toLowerCase().trim();
        user.password = createUserDto.password.trim();
        user.role = UserRole.CLIENT;

        try{
            await user.save()

            await this.sendEmailValidationLink( user.email );
      
            const token = await JwtAdapter.generateToken({ id: user.id } )
            if( !token ) throw CustomError.internalServer('Error while creating JWT')
      
            return {
              token,
              user,
            }
        }catch(error: any){
            throw CustomError.internalServer("Something went very wrong! ❌")
        }

    }
   //----------------------------------------------------------------------------------
   public sendEmailValidationLink = async ( email: string ) => {

     const token = await JwtAdapter.generateToken({ email })
     if( !token ) throw CustomError.internalServer('Error getting token')

     const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${ token }`;
     const html = `
       <h1>Validate your email</h1>
       <p>Click on the following link to validate your email</p>
       <a href="${ link }">Validate your email: ${email}</a>`

     const isSent = await this.emailService.sendEmail({  // pq no hay un await
       to: email,
       subject: 'Validate your email',
       htmlBody: html    // le evia el html con el link para validar email
     })
     if( !isSent ) throw CustomError.internalServer('Error sending email');
 
     return true;
   }  
  //----------------------------------------------------------------------------------
   public validateEmail = async(token:string) => {

     const payload = await JwtAdapter.validateToken(token)    // valida token
     if( !payload ) throw CustomError.unAuthorized('Invalid Token');

     const { email } = payload as { email: string };
     if( !email ) throw CustomError.internalServer('Email not in token');

     const user = await User.findOne({ where: { email: email }})
     if( !user ) throw CustomError.internalServer('Email not exist')

     user.emailValidated = true;
     try {
       await user.save()

       return true;
     } catch (error) {
       throw CustomError.internalServer("Something went very wrong");
     }
   }
   //-------------------------------------------------------------------------
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
    //-------------------------------------------------------------------------
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
    //-------------------------------------------------------------------------
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
    //-------------------------------------------------------------------------
    async deleteUserById(id:number){
        const user= await this.findUserById(id);

        user.status= UserStatus.DISABLED;
        try{
            await user.save();

        }catch(error: any){
            throw CustomError.internalServer("Something went very wrong! ❌")
        }
    }

    //-------------------------------------------------------------------------
    public async login( loginUserDTO: LoginUserDTO ){
        //1. buscar el usuario que se quiere loguear
        const user = await User.findOne({
          where: {
            email: loginUserDTO.email,
            status: UserStatus.AVAILABLE,
          }
        })
        if( !user ) throw CustomError.unAuthorized("Invalid credentials")
        //2. validar si la contraseña es correcta
        const isMatching = bcryptAdapter.compare(loginUserDTO.password, user.password);
        if( !isMatching ) throw CustomError.unAuthorized("Invalid credentials")
        //3. generar el token 
        const token = await JwtAdapter.generateToken({ id: user.id })
        if( !token ) throw CustomError.internalServer('Error while creating JWT')
        //4. enviar la informacion al cliente
        return {
          token: token,
          user: {
            id: user.id,
            firstName: user.first_name,
            surname: user.surname,
            email: user.email,
            role: user.role,
          }
        }
      }

}