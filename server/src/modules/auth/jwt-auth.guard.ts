import { Injectable } from '@nestjs/common';
import { AuthGuard, } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}


@Injectable()
export class AllowNullUserGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    return user || null;
  }
}
