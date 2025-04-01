import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResolvePromisesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {

        if(!data) {
          return {
            metadata: null,
            message: 'Successfully',
            options: null
          }
        }

        const metadata = data && 'metadata' in data ? data.metadata : data;
        const message = 'message' in data ? data.message : 'Successfully';
        const options = 'options' in data ? data.options : null;

        return {
          metadata,
          message,
          options,
        };
      }),
    );
  }
}
