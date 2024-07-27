import { regularExps } from "../../../config/regular-exp";


export class UpdateUserDto {

    private constructor(
      public readonly name: string,
      public readonly email: string,
    ) {}
  
    static create (object: { [key: string]: any }): [string?, UpdateUserDto?] {
      const { name, email} = object;
  
      if (!name) return ['Missing name']
      if (!email) return ['Missing email']
      if (!regularExps.email.test(email)) return ['Invalid email']
      
      return [undefined, new UpdateUserDto(name, email)]
    }
  }