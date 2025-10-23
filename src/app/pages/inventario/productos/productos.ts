import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '@services/producto.service';
import { CategoriaService } from '@services/categoria.service';
import { MarcaService } from '@services/marca.service';
import { Producto } from '@interfaces/producto';
import { Categoria } from '@interfaces/categoria';
import { Marca } from '@interfaces/marca';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './productos.html',
})
export class ProductosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private marcaService = inject(MarcaService);

  productos: Producto[] = [];
  categorias: Categoria[] = [];
  marcas: Marca[] = [];

  form!: FormGroup;
  producto?: Producto;

  mostrarFormulario = false;
  loading = false;

  filtroTexto = '';
  filtroCategoria = '';
  filtroMarca = '';

  // Modales de categoria y marca
  mostrarFormCategoria = false;
  mostrarFormMarca = false;
  formCategoria!: FormGroup;
  formMarca!: FormGroup;

  // Paginación
  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;

  ngOnInit(): void {
    this.initForm();
    this.initFormCategoria();
    this.initFormMarca();
    this.loadAll();
    this.loadCategorias();
    this.loadMarcas();
  }

  /** Inicializa el formulario */
  initForm(producto?: Producto) {
    this.form = this.fb.group({
      nombre: [producto?.nombre || '', [Validators.required]],
      descripcion: [producto?.descripcion || '', [Validators.required]],
      codigo: [producto?.codigo || '', [Validators.required]],
      precio_venta: [producto?.precio_venta || 0, [Validators.required, Validators.min(0)]],
      costo_compra: [producto?.costo_compra || 0, [Validators.required, Validators.min(0)]],
      stock: [producto?.stock || 0, [Validators.required, Validators.min(0)]],
      stock_minimo: [producto?.stock_minimo || 0, [Validators.required, Validators.min(0)]],
      imagen_url: [producto?.imagen_url || ''],
      marca_id: [producto?.marca_id || producto?.marca?.id || null, [Validators.required]],
      categoria_id: [producto?.categoria_id || producto?.categoria?.id || null, [Validators.required]],
    });
  }

  /** Carga todos los productos */
  loadAll() {
    this.productoService.listarProductos(this.page, this.size).subscribe({
      next: (res: any) => {
        if (res.content) {
          this.productos = res.content;
          this.totalPages = res.totalPages;
          this.totalElements = res.totalElements;
        } else {
          this.productos = res;
          this.totalPages = Math.ceil(res.length / this.size);
          this.totalElements = res.length;
        }
      },
      error: (err) => console.error('Error al cargar productos', err),
    });
  }

  /** Carga las categorías */
  loadCategorias() {
    this.categoriaService.list().subscribe({
      next: (categorias) => (this.categorias = categorias),
      error: () => alert('Error al cargar categorías.'),
    });
  }

  /** Carga las marcas */
  loadMarcas() {
    this.marcaService.list().subscribe({
      next: (marcas) => (this.marcas = marcas),
      error: () => alert('Error al cargar marcas.'),
    });
  }

  /** Abre formulario */
  abrirFormulario(producto?: Producto) {
    this.producto = producto;
    this.initForm(producto);
    this.mostrarFormulario = true;
  }

  /** Cierra formulario */
  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.producto = undefined;
    this.form.reset();
  }

  /** Guardar o actualizar producto */
  save() {
    if (this.form.invalid) return;

    this.loading = true;
    const productoForm = this.form.value;

    const request = this.producto
      ? this.productoService.actualizarProducto(this.producto.id, productoForm)
      : this.productoService.registrarProducto(productoForm);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.mostrarFormulario = false;
        this.loadAll();
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al guardar producto:', err);
        alert('Error al guardar el producto');
      },
    });
  }

  /** Eliminar producto */
  deleteProducto(producto: Producto) {
    if (!confirm(`¿Eliminar producto "${producto.nombre}"?`)) return;

    this.productoService.eliminarProducto(producto.id).subscribe({
      next: () => this.loadAll(),
      error: () => alert('Error al eliminar el producto'),
    });
  }

  /** Filtro local */
  filtrarProductos() {
    const texto = this.filtroTexto.toLowerCase();
    return this.productos.filter((p) => {
      const coincideTexto =
        p.nombre.toLowerCase().includes(texto) || p.codigo.toLowerCase().includes(texto);
      const coincideCategoria = this.filtroCategoria
        ? p.categoria_id?.toString() === this.filtroCategoria
        : true;
      const coincideMarca = this.filtroMarca
        ? p.marca_id?.toString() === this.filtroMarca
        : true;
      return coincideTexto && coincideCategoria && coincideMarca;
    });
  }

  /** Cambiar página */
  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina < 0 || nuevaPagina >= this.totalPages) return;
    this.page = nuevaPagina;
    this.loadAll();
  }

  /** Formulario de categoría */
  initFormCategoria() {
    this.formCategoria = this.fb.group({
      nombre: ['', [Validators.required]]
    });
  }

  abrirFormCategoria() {
    this.mostrarFormCategoria = true;
    this.formCategoria.reset();
  }

  cerrarFormCategoria() {
    this.mostrarFormCategoria = false;
    this.formCategoria.reset();
  }

  saveCategoria() {
    if (this.formCategoria.invalid) return;
    
    this.categoriaService.create(this.formCategoria.value).subscribe({
      next: () => {
        this.cerrarFormCategoria();
        this.loadCategorias();
      },
      error: () => alert('Error al crear la categoría')
    });
  }

  /** Formulario de marca */
  initFormMarca() {
    this.formMarca = this.fb.group({
      nombre: ['', [Validators.required]]
    });
  }

  abrirFormMarca() {
    this.mostrarFormMarca = true;
    this.formMarca.reset();
  }

  cerrarFormMarca() {
    this.mostrarFormMarca = false;
    this.formMarca.reset();
  }

  saveMarca() {
    if (this.formMarca.invalid) return;
    
    this.marcaService.create(this.formMarca.value).subscribe({
      next: () => {
        this.cerrarFormMarca();
        this.loadMarcas();
      },
      error: () => alert('Error al crear la marca')
    });
  }
}
