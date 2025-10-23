import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MarcaService } from '@services/marca.service';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Marca } from '@interfaces/marca';

@Component({
  selector: 'app-marcas',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './marcas.html'
})
export class MarcasComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private marcaService = inject(MarcaService);

  marcas: Marca[] = [];
  mostrarFormulario = false;
  marca?: Marca;
  form!: FormGroup;


  ngOnInit(): void {
    this.initForm();
    this.loadAll();
  }

  initForm(marca?: Marca) {
    this.form = this.fb.group({
      nombre: [marca?.nombre || '', [Validators.required]]
    });
  }

  loadAll(){
    this.marcaService.list()
    .subscribe(marcas => {
      this.marcas = marcas;
    });
  }

  abrirFormulario(marca?: Marca) {
    this.marca = marca;
    this.initForm(marca);
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.marca = undefined;
    this.form.reset();
  }

  save() {
    if (this.form.invalid) return;
    
    const marcaForm = this.form.value;

    const request = this.marca
      ? this.marcaService.update(this.marca.id, marcaForm)
      : this.marcaService.create(marcaForm);

    request.subscribe({
      next: () => {
        this.cerrarFormulario();
        this.loadAll();
      },
      error: () => alert('Error al guardar la marca')
    });
  }

  deleteMarca(marca: Marca){
    if (!confirm(`¿Eliminar marca ${marca.nombre}?`)) return;
    this.marcaService.delete(marca.id)
    .subscribe(() => {
      this.loadAll();
    });
  }
}