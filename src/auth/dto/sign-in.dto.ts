import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Definition of information that will be transmitted about login authentication in requests
 * @class SignInDto
 */
export class SignInDto {

  /**
   * Username identifier
   * @property username
   */
  @ApiProperty({ example: 'igma', description: 'Username or login.', type: String })
  @IsString()
  @IsNotEmpty()
  username: string;

  /**
   * Secret phrase to authentication
   * @property password
   */
  @ApiProperty({ example: 'secret', description: 'Secret phrase to authentication.', type: String })
  @IsString()
  @IsNotEmpty()
  password: string;

  /**
   * User's ID
   * @property userId
   */
  @ApiProperty({ example: '1', description: 'User identifier.', type: String  })
  @IsNotEmpty()
  userId: string;
}
