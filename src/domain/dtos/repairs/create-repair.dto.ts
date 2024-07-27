
export class CreateRepairDto {

    private constructor(
      public readonly date: Date,
      public readonly motorsNumber: number,
      public readonly description: string,
      //public readonly userId: number
    ) {}
  
    static create (object: { [key: string]: any }): [string?, CreateRepairDto?] {
      const { date, motorsNumber, description } = object;
  
      if (!date) return ['Missing name']
      if (!motorsNumber) return ['Missing email']
      if (!description) return ['Missing descrition']
      //if (!userId) return ['Missing userId']
  
      return [undefined, new CreateRepairDto(date, motorsNumber, description)]
    }
  }