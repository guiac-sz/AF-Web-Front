import { Component, OnInit, inject } from '@angular/core';
import { MovimentacaoService, Movimentacao } from '../movimentacao-service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [FormsModule, DatePipe],
  templateUrl: './home.html',
  standalone: true,
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private api = inject(MovimentacaoService);

  movimentacoes: Movimentacao[] = [];
  carregando = false;
  salvando = false;
  erro = '';

  // Bindings do formulário
  descricao = '';
  categoria = '';
  tipo: 'entrada' | 'saida' = 'entrada';
  valor: number | null = null;
  data = '';
  filtroCategoria = '';

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.carregando = true;
    this.api.listar().subscribe({
      next: xs => { this.movimentacoes = xs; this.carregando = false; },
      error: e => { this.erro = e.message ?? 'Falha ao carregar'; this.carregando = false; }
    });
  }

  criar() {
    if (!this.descricao || !this.categoria || !this.tipo || this.valor == null || !this.data) {
      this.erro = 'Preencha todos os campos.';
      return;
    }

    const movimentacao: Movimentacao = {
      descricao: this.descricao,
      categoria: this.categoria,
      tipo: this.tipo,
      valor: Number(this.valor),
      data: this.data
    };

    this.salvando = true;
    this.api.criar(movimentacao).subscribe({
      next: _ => {
        this.descricao = '';
        this.categoria = '';
        this.tipo = 'entrada';
        this.valor = null;
        this.data = '';
        this.salvando = false;
        this.carregar();
      },
      error: e => {
        this.erro = e.message ?? 'Falha ao criar';
        this.salvando = false;
      }
    });
  }

  excluir(id?: string) {
    if (!id) return;
    this.api.excluir(id).subscribe({
      next: _ => this.carregar(),
      error: e => this.erro = e.message ?? 'Falha ao excluir'
    });
  }

  get saldo() {
    return this.movimentacoes.reduce((acc, mov) => {
      return mov.tipo === 'entrada'
        ? acc + mov.valor
        : acc - mov.valor;
    }, 0);
  }

  get filtradas() {
    if (!this.filtroCategoria.trim()) return this.movimentacoes;
    return this.movimentacoes.filter(m =>
      m.categoria.toLowerCase().includes(this.filtroCategoria.toLowerCase())
    );
  }
}
