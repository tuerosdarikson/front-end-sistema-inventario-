import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CategoriaService } from '@services/categoria.service';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categoria } from '@interfaces/categoria';
@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './categorias.html'
})
export class CategoriasComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private categoriaService = inject(CategoriaService);

  categorias: Categoria[] = [];
  mostrarFormulario = false;
  categoria?: Categoria;
  form!: FormGroup;


  ngOnInit(): void {
    this.initForm();
    this.loadAll();
  }

  initForm(categoria?: Categoria) {
    this.form = this.fb.group({
      nombre: [categoria?.nombre || '', [Validators.required]]
    });
  }

  loadAll(){
    this.categoriaService.list()
    .subscribe(categorias => {
      this.categorias = categorias;
    });
  }

  abrirFormulario(categoria?: Categoria) {
    this.categoria = categoria;
    this.initForm(categoria);
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.categoria = undefined;
    this.form.reset();
  }

  save() {
    if (this.form.invalid) return;
    
    const categoriaForm = this.form.value;

    const request = this.categoria
      ? this.categoriaService.update(this.categoria.id, categoriaForm)
      : this.categoriaService.create(categoriaForm);

    request.subscribe({
      next: () => {
        this.cerrarFormulario();
        this.loadAll();
      },
      error: () => alert('Error al guardar la categoría')
    });
  }

  deleteCategoria(categoria: Categoria){
    if (!confirm(`¿Eliminar categoría ${categoria.nombre}?`)) return;
    this.categoriaService.delete(categoria.id)
    .subscribe(() => {
      this.loadAll();
    });
  }
}