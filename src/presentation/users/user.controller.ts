import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { CustomError } from "../../domain/errors/custom.errors";
import { LoginUserDTO } from "../../domain/dtos/user/login-user.dto";
import { CreateUserDto } from "../../domain";
import { UpdateUserDto } from "../../domain/dtos/user/update-user.dto";

export class UserController{ 

    constructor(public userService: UserService){ }

    private handleError=(error: unknown, res: Response)=>{
      console.log(error)
      if(error instanceof CustomError){
         return res.status(error.statusCode).json({message: error.message})
      }
      return res.status(500).json({message:"Something went very wrong! ❌" })
    }
    //---------------------------------------------------------------
    createUser=(req: Request, res: Response)=>{
    
      const [ error, createUserDto ] = CreateUserDto.create(req.body);
      if(error) return res.status(422).json({ message: error }); 

        this.userService.createUser(createUserDto!)
         .then(user => res.status(201).json(user))
         .catch((error:any)=>{this.handleError(error, res)})
    }
    //---------------------------------------------------------------
    findAllUsers=(_req: Request, res: Response)=>{

      this.userService.findAllUsers()
         .then(users => res.status(200).json(users))
         .catch((error:any)=>{console.log(error)})
    }
    //---------------------------------------------------------------
    findUserById=(req: Request, res: Response)=>{
      const {id}=req.params;

      if(isNaN(+id)){
         return res.status(400).json({ message: 'the id have to be a number' })
      }
      this.userService.findUserById(+id)
          .then(user => res.status(200).json(user))
          .catch((error:any)=>{this.handleError(error, res)})
    }
    //---------------------------------------------------------------
    updateUser=(req: Request, res: Response)=>{
        const {id}=req.params;
        if(isNaN(+id)){
          return res.status(400).json({ message: 'the id have to be a number' })
       }
       const [ error, updateUserDto ] = UpdateUserDto.create(req.body);
       if(error) return res.status(422).json({ message: error });  
        
        this.userService.updateUserById(updateUserDto, +id)
          .then(user=>{res.status(200).json(user)})
          .catch((error:any)=>{this.handleError(error, res)})
    }
    //---------------------------------------------------------------
    deleteUserById=(req: Request, res: Response)=>{
      const {id} = req.params;
      if(isNaN(+id)){
         return res.status(400).json({ message: 'the id have to be a number' })
      }
      this.userService.deleteUserById(+id)
        .then(() => res.status(204).json())
        .catch((error:any)=>{this.handleError(error, res)})
    }
    //---------------------------------------------------------------
    login = async (req: Request, res: Response) => {
      const [ error, loginUserDto ] = LoginUserDTO.create(req.body);
      if(error) return res.status(422).json({ message: error });
  
      this.userService.login(loginUserDto!)
          .then(data => res.status(200).json(data))
          .catch(error => this.handleError(error, res))
    }
    //---------------------------------------------------------------
    validateEmail = (req: Request, res: Response) => {
      const { token } = req.params;
  
      this.userService.validateEmail( token )
          .then(() => res.json('Email was validated properly'))
          .catch(error => this.handleError(error, res))
    }
}