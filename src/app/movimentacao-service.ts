import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Movimentacao {
  _id?: string;
  descricao: string;
  categoria: string;
  tipo: "entrada" | "saida";
  valor: number;
  data: string;
}

@Injectable({
  providedIn: 'root'
})

export class MovimentacaoService {
  private http = inject(HttpClient);
  private base = `http://localhost:3000/movimentacoes`;

    listar(): Observable<Movimentacao[]> {
      return this.http.get<Movimentacao[]>(this.base);
    }
    buscarPorId(id: string): Observable<Movimentacao> {
      return this.http.get<Movimentacao>(`${this.base}/${id}`);
    }
    criar(movimentacao: Movimentacao): Observable<Movimentacao> {
      console.log(movimentacao);
      return this.http.post<Movimentacao>(this.base, movimentacao);
    }
    atualizar(id: string, movimentacao: Partial<Movimentacao>): Observable<Movimentacao> {
      return this.http.patch<Movimentacao>(`${this.base}/${id}`, movimentacao);
    }
    excluir(id: string) {
      return this.http.delete(`${this.base}/${id}`);
    }
}
