import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/role-protected.decorator';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  
  constructor(
    private readonly reflector: Reflector
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    const validRoles: string[] = this.reflector.get( META_ROLES , context.getHandler() )

    if ( !validRoles ) return true;
    if ( validRoles.length === 0 ) return true;
    
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if ( !user ) 
      throw new BadRequestException('User not found');
    
    const roles = user.roles.split(',')
    for (const role of validRoles ) {
      if ( roles.includes( role ) ) {
        console.log(roles);
        return true;
      }
    }
    throw new ForbiddenException(
      `User ${ user.username } need a valid role: [${ validRoles }]`
    );
  }
}
