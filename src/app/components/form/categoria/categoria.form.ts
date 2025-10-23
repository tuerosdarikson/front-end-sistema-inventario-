import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder,ReactiveFormsModule, Validators, FormGroup  } from "@angular/forms";
import { RouterModule,Router, ActivatedRoute } from "@angular/router";
import { CategoriaService } from "@services/categoria.service";
import { FormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { Categoria } from "@interfaces/categoria";


@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './categoria.form.html'
})
export class CategoriaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private categoriaService = inject(CategoriaService);

  form!: FormGroup;
  categoria?: Categoria;

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        
        if (id){
          this.categoriaService.get(parseInt(id))
            .subscribe(categoria=>{
              this.categoria = categoria;
              this.form = this.fb.group({
                nombre: [categoria.nombre, [Validators.required]] })
              console.log("categoria", categoria);
            })
        } else{
          this.form = this.fb.group({
            nombre: ['',[Validators.required]]
          })
        }
    }

  save(){
    if (this.form.invalid) return;
    const categoriaForm = this.form.value;

    if (this.categoria) {
      this.categoriaService.update(this.categoria.id, categoriaForm).subscribe(()=>{
        this.router.navigate(['/inventario/categorias'])
      })
    }else{
    this.categoriaService.create(categoriaForm).subscribe({
      next: () => this.router.navigate(['/inventario/categorias']),
      error: () => alert('Error al crear la categoría')
    });
  }
  }
}