import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder,ReactiveFormsModule, Validators, FormGroup  } from "@angular/forms";
import { RouterModule,Router, ActivatedRoute } from "@angular/router";
import { MarcaService } from "@services/marca.service";
import { FormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { Marca } from "@interfaces/marca";


@Component({
  selector: 'app-marca-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './marca.form.html'
})
export class MarcaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private marcaService = inject(MarcaService);

  form!: FormGroup;
  marca?: Marca;

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        
        if (id){
          this.marcaService.get(parseInt(id))
            .subscribe(marca=>{
              this.marca = marca;
              this.form = this.fb.group({
                nombre: [marca.nombre, [Validators.required]] })
              console.log("marca", marca);
            })
        } else{
          this.form = this.fb.group({
            nombre: ['',[Validators.required]]
          })
        }
    }

  save(){
    if (this.form.invalid) return;
    const marcaForm = this.form.value;

    if (this.marca) {
      this.marcaService.update(this.marca.id, marcaForm).subscribe(()=>{
        this.router.navigate(['/inventario/marcas'])
      })
    }else{
    this.marcaService.create(marcaForm).subscribe({
      next: () => this.router.navigate(['/inventario/marcas']),
      error: () => alert('Error al crear la marca')
    });
  }
  }
}