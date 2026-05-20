import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const userId = req.user?.userId;
    const method = req.method;
    const url = req.url;

    return next.handle().pipe(
      tap((data) => {
        if (userId && ['POST', 'PUT', 'DELETE'].includes(method)) {
          const entityType = url.split('/')[1] || 'SYSTEM';
          const entityId = data?.id || req.params?.id || 'UNKNOWN';
          this.auditService.logAction(userId, `${method} ${entityType.toUpperCase()}`, entityType, entityId, req.body).catch(e => console.error('Audit Log failed', e));
        }
      }),
    );
  }
}
