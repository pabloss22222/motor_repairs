
import nodemailer, { Transporter } from 'nodemailer'

export interface SendEmailOptions {    
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachment[];
}

interface Attachment {
  filename: string;
  path: string;
}
//--------------------------------------------------------------------
export class EmailService {

  private transporter: Transporter;

  constructor(
      mailerService: string,  // servicio de email
      mailerEmail: string,     // desde
      senderEmailPassword: string,  //contrSEÑA
      private readonly postToProvider: boolean, // !!!! se envia o no?
  ) {
    this.transporter = nodemailer.createTransport({
      service: mailerService,
      auth: {
        user: mailerEmail,
        pass: senderEmailPassword
      }
    })
  }
  //--------------------------------------------------------------------
  async sendEmail( options: SendEmailOptions ) {
    const { to, subject, htmlBody, attachments = [] } = options;

    if( !this.postToProvider ) return true;

    try {
      await this.transporter.sendMail({to: to, subject: subject, html: htmlBody, attachments: attachments }) // espera a q se envie el email, si es así retorna true
      return true;

    } catch (error) {
      console.log(error);
      return false;
    }
  }
  
}
