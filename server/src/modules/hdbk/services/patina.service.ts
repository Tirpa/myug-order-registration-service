import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Observable, from, of, switchMap, tap } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Patina } from '../entities/patina.entity';
import { CreatePatinaInput } from '../inputs/create.patina.input';
import { UpdatePatinaInput } from '../inputs/update.patina.input';
import { HDBK_CACHE_KEY } from './hdbk.service';

export const PATINA_CACHE_KEY = 'patinas';

@Injectable()
export class PatinaService {
  constructor(
    @InjectRepository(Patina)
    private readonly repository: Repository<Patina>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  create(input: CreatePatinaInput): Observable<Patina> {
    return this.findByName(input.name).pipe(
      switchMap((entity) => {
        if (entity) {
          throw new HttpException(
            `Элемент с названием "${input.name}" уже существует.`,
            HttpStatus.CONFLICT,
          );
        }
        return from(this.repository.save({ ...input }));
      }),
      tap(() => this.removeCache()),
    );
  }
  update(input: UpdatePatinaInput): Observable<any> {
    return from(this.repository.update({ id: input.id }, { ...input })).pipe(
      tap(() => this.removeCache()),
    );
  }
  findAll(): Observable<Patina[]> {
    return from(this.repository.find());
  }
  delete(id: number): Observable<number> {
    return from(this.repository.delete(id)).pipe(
      switchMap(() => of(id)),
      tap(() => this.removeCache()),
    );
  }
  findByName(name: string): Observable<Patina> {
    return from(
      this.repository
        .createQueryBuilder()
        .where('LOWER(name) = LOWER(:name)', { name })
        .getOne(),
    );
  }
  private removeCache() {
    this.cacheManager.del(PATINA_CACHE_KEY);
    this.cacheManager.del(HDBK_CACHE_KEY);
  }
}
