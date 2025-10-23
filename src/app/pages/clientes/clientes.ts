import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '@services/cliente.service';
import { Cliente, TipoCliente } from '@interfaces/cliente';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './clientes.html'
})
export class ClientesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);

  clientes: Cliente[] = [];
  form!: FormGroup;
  cliente?: Cliente;
  tiposCliente = Object.values(TipoCliente);

  mostrarFormulario = false;
  loading = false;

  ngOnInit(): void {
    this.initForm();
    this.loadAll();
  }

  // Inicializa el formulario
  initForm(cliente?: Cliente) {
    this.form = this.fb.group({
      persona: this.fb.group({
        nombre: [cliente?.persona?.nombre || '', [Validators.required]],
        apellido_paterno: [cliente?.persona?.apellido_paterno || '', [Validators.required]],
        apellido_materno: [cliente?.persona?.apellido_materno || '', [Validators.required]],
        correo: [cliente?.persona.correo || '', [Validators.required, Validators.email]],
        telefono: [cliente?.persona.telefono || '', [Validators.required]]
      }),
      tipo_cliente: [cliente?.tipo_cliente || TipoCliente.PERSONA_NATURAL, [Validators.required]],
      documento_identidad: [cliente?.documento_identidad || ''],
      razon_social: [cliente?.razon_social || ''],
      ruc_empresa: [cliente?.ruc_empresa || '']
    });

    this.toggleFields(this.form.get('tipo_cliente')?.value as TipoCliente);

    this.form.get('tipo_cliente')?.valueChanges.subscribe(tipo =>
      this.toggleFields(tipo as TipoCliente)
    );
  }

  // Carga todos los clientes 
  loadAll() {
    this.clienteService.list().subscribe(clientes => (
      console.log(clientes),
      this.clientes = clientes));
  }

  // Obtiene la cantidad de clientes por tipo
  getClientesPorTipo(tipo: string): number {
    return this.clientes.filter(cliente => cliente.tipo_cliente === tipo).length;
  }

  // Abre formulario para crear o editar
  abrirFormulario(cliente?: Cliente) {
    console.log('Cliente a editar:', cliente);
    this.cliente = cliente;
    this.initForm(cliente);
    this.mostrarFormulario = true;
  }

  // Cierra el modal del formulario
  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.cliente = undefined;
    this.form.reset();
  }

  // Habilita o deshabilita campos según tipo de cliente 
  toggleFields(tipo: TipoCliente) {
    const razon = this.form.get('razon_social');
    const ruc = this.form.get('ruc_empresa');
    const doc = this.form.get('documento_identidad');

    if (tipo === TipoCliente.EMPRESA) {
      razon?.enable();
      ruc?.enable();
      doc?.enable();
      razon?.setValidators([Validators.required]);
      ruc?.setValidators([Validators.required]);
      doc?.setValidators([Validators.required]);
    } else {
      razon?.disable();
      ruc?.disable();
      razon?.clearValidators();
      ruc?.clearValidators();
      doc?.setValidators([Validators.required]);
    }

    razon?.updateValueAndValidity();
    ruc?.updateValueAndValidity();
    doc?.updateValueAndValidity();
  }

  // Guarda (crear o actualizar) 
  save() {
    if (this.form.invalid) return;

    this.loading = true;
    const tipo = this.form.get('tipo_cliente')?.value as TipoCliente;
    const rawData = this.form.value;

    // Eliminar los campos vacíos según el tipo de cliente
    const clienteForm: any = {
      persona: rawData.persona,
      tipo_cliente: tipo
    };

    if (tipo === TipoCliente.EMPRESA) {
      clienteForm.razon_social = rawData.razon_social;
      clienteForm.ruc_empresa = rawData.ruc_empresa;
      clienteForm.documento_identidad = rawData.documento_identidad?.trim()
        ? rawData.documento_identidad
        : undefined;
    } else {
      clienteForm.documento_identidad = rawData.documento_identidad;
    }

    const request = this.cliente
      ? this.clienteService.update(this.cliente.id, clienteForm)
      : this.clienteService.create(clienteForm);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.mostrarFormulario = false;
        this.loadAll();
      },
      error: () => {
        this.loading = false;
        alert('Error al guardar el cliente');
      }
    });
  }

  // Eliminar cliente 
  deleteCliente(cliente: Cliente) {
    if (!confirm(`¿Eliminar cliente ${cliente.persona.nombre}?`)) return;
    this.clienteService.delete(cliente.id).subscribe(() => this.loadAll());
  }
}
