import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MovimientoService } from '@services/movimiento.service';
import { ProductoService } from '@services/producto.service';
import { MovimientoStock, MovimientoPayload, TipoMovimiento } from '@interfaces/movimientos';
import { ProductoSimple } from '@interfaces/producto';
import { usuariosimple } from '@interfaces/usuario';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './movimientos.html'
})
export class MovimientosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private movimientoService = inject(MovimientoService);
  private productoService = inject(ProductoService);

  movimientos: MovimientoStock[] = [];
  movimientosFiltrados: MovimientoStock[] = [];

  form!: FormGroup;
  showCreateForm = false;
  isSubmitting = false;

  productos: ProductoSimple[] = []; // Lista de productos disponibles
  usuarioLogueado: usuariosimple = { id: 1, nombre: 'YAN' }; // Usuario actual

  // Exponer el enum para usar en la plantilla
  TipoMovimiento = TipoMovimiento;

  filtroTipo: TipoMovimiento | '' = '';
  filtroProducto = '';
  fechaDesde = '';
  fechaHasta = '';

  ngOnInit(): void {
    this.loadMovimientos();
    this.loadProductos();
    this.initForm();
  }

  // Método alternativo para probar diferentes estrategias de carga
  private tryAlternativeProductLoad() {
    console.log('🔄 Intentando cargas alternativas de productos...');
    
    // Intentar con página 0 y tamaño 10 (configuración por defecto)
    this.productoService.listarProductos().subscribe({
      next: (productos) => {
        console.log('✅ Productos con configuración por defecto:', productos);
        if (productos && productos.length > 0) {
          this.processProductosResponse(productos);
        }
      },
      error: (err) => {
        console.log('❌ Error con configuración por defecto, intentando filtro...');
        
        // Intentar usando filtro con objeto vacío
        const filtroVacio = {} as any;
        this.productoService.filtrarProductos(filtroVacio).subscribe({
          next: (response) => {
            console.log('✅ Productos usando filtro:', response);
            this.processProductosResponse(response);
          },
          error: (filtroErr) => {
            console.error('❌ Todas las estrategias fallaron:', filtroErr);
          }
        });
      }
    });
  }

  // Procesar respuesta de productos independientemente del método usado
  private processProductosResponse(response: any) {
    let productos: any[] = [];
    
    if (Array.isArray(response)) {
      productos = response;
    } else if (response && response.content) {
      productos = response.content;
    } else if (response && response.data) {
      productos = response.data;
    }

    if (productos && productos.length > 0) {
      this.productos = productos
        .filter(producto => producto && producto.id && producto.nombre)
        .map(producto => ({
          id: producto.id,
          nombre: producto.nombre.trim(),
          stock: producto.stock || 0
        }))
        .filter(p => p.nombre !== '');
      
      console.log(`✅ Productos procesados exitosamente: ${this.productos.length}`);
    }
  }

  initForm(movimiento?: MovimientoStock) {
    this.form = this.fb.group({
      producto: [movimiento?.producto || null, [Validators.required]],
      tipo_movimiento: [movimiento?.tipo_movimiento || TipoMovimiento.ENTRADA, [Validators.required]],
      cantidad: [movimiento?.cantidad || 1, [Validators.required, Validators.min(1)]],
      fecha: [movimiento?.fecha || new Date(), [Validators.required]],
      referencia: [movimiento?.referencia || '']
    });
  }

  loadMovimientos() {
    this.movimientoService.list().subscribe(data => {
      this.movimientos = data.map(mv => ({
        ...mv,
        fecha: new Date(mv.fecha)
      })) as MovimientoStock[];
      this.movimientosFiltrados = [...this.movimientos];
    });
  }

  loadProductos() {
    console.log('🔍 Iniciando carga de productos usando ProductoService...');
    
    // Usar el ProductoService para cargar productos con paginación grande para obtener todos
    this.productoService.listarProductos(0, 1000).subscribe({
      next: (response) => {
        console.log('✅ Respuesta completa del ProductoService:', response);
        
        // El ProductoService.listarProductos() devuelve Observable<Producto[]>
        let productos: any[] = [];
        
        if (Array.isArray(response)) {
          // La respuesta es directamente un array de productos
          productos = response;
        } else if (response && (response as any).content) {
          // Si es una respuesta paginada con formato Spring Boot
          productos = (response as any).content;
        } else if (response && (response as any).data) {
          // Si la respuesta tiene formato { data: [...] }
          productos = (response as any).data;
        } else {
          console.warn('⚠️ Formato de respuesta no reconocido:', response);
          productos = [];
        }
        
        console.log('📊 Productos extraídos de la respuesta:', productos);
        console.log('📊 Cantidad de productos:', productos?.length || 0);
        
        if (!productos || productos.length === 0) {
          console.warn('⚠️ No hay productos disponibles');
          this.productos = [];
          alert('No hay productos registrados en el sistema. Por favor, registre algunos productos primero en la sección de Inventario > Productos.');
          return;
        }

        // Mapear productos a la estructura simple requerida
        this.productos = productos
          .filter(producto => producto && producto.id && producto.nombre) // Filtrar productos válidos
          .map(producto => ({
            id: producto.id,
            nombre: producto.nombre.trim(),
            stock: producto.stock || 0
          }))
          .filter(p => p.nombre !== ''); // Filtrar nombres vacíos después del trim
        
        console.log(`📦 Productos procesados para el componente: ${this.productos.length}`, this.productos);
        
        if (this.productos.length === 0) {
          console.log('⚠️ No se obtuvieron productos válidos, intentando estrategias alternativas...');
          this.tryAlternativeProductLoad();
        } else {
          console.log('✅ Productos cargados exitosamente para movimientos de stock');
        }
      },
      error: (err) => {
        console.error('❌ Error al consumir ProductoService.listarProductos():', err);
        console.error('📋 Detalles completos del error:', {
          message: err.message,
          status: err.status,
          statusText: err.statusText,
          url: err.url,
          error: err.error
        });
        
        this.productos = [];
        
        // Mensajes de error específicos basados en el tipo de error
        let errorMessage = 'Error al cargar productos desde el backend.';
        
        if (err.status === 0) {
          errorMessage = `No se puede conectar con el backend. 
                         Verifique que el servidor esté funcionando en: http://localhost:8080
                         Endpoint: GET ${this.productoService['baseUrl']}`;
        } else if (err.status === 404) {
          errorMessage = `Endpoint no encontrado (404). 
                         Verifique que la URL sea correcta: ${this.productoService['baseUrl']}`;
        } else if (err.status === 401) {
          errorMessage = 'No autorizado (401). Verifique su token de autenticación.';
        } else if (err.status === 403) {
          errorMessage = 'Acceso prohibido (403). No tiene permisos para acceder a los productos.';
        } else if (err.status === 500) {
          errorMessage = 'Error interno del servidor (500). Contacte al administrador del sistema.';
        } else {
          errorMessage = `Error ${err.status}: ${err.error?.message || err.message || 'Error desconocido'}`;
        }
        
        console.log('🔄 Error en método principal, intentando estrategias alternativas...');
        this.tryAlternativeProductLoad();
        
        // Solo mostrar alert si todas las estrategias fallan
        setTimeout(() => {
          if (this.productos.length === 0) {
            alert(errorMessage);
          }
        }, 2000);
      }
    });
  }

  openCreateModal(tipo: TipoMovimiento) {
    this.initForm({
      tipo_movimiento: tipo,
      producto: { id: 0, nombre: '' },
      cantidad: 1,
      fecha: new Date(),
      referencia: ''
    } as MovimientoStock);
    this.showCreateForm = true;
  }

  closeCreateModal() {
    this.showCreateForm = false;
    this.form.reset();
  }

  createMovimiento() {
    if (this.form.invalid) return;

    this.isSubmitting = true;
    const formValue = this.form.value;

    // Validaciones adicionales
    if (!formValue.producto || !formValue.producto.id) {
      alert('Debe seleccionar un producto válido.');
      this.isSubmitting = false;
      return;
    }

    const payload: MovimientoPayload = {
      producto_id: formValue.producto.id,  // Enviar solo el ID del producto
      tipo_movimiento: formValue.tipo_movimiento,
      cantidad: formValue.cantidad,
      fecha: formValue.fecha instanceof Date ? formValue.fecha : new Date(formValue.fecha),
      referencia: formValue.referencia
    };

    console.log('📤 Enviando movimiento al backend:', payload);

    // Regla de negocio: ajuste de stock local según tipo de movimiento
    const productoActual = this.productos.find(p => p.id === formValue.producto.id);
    if (!productoActual) {
      alert(`Producto con ID ${formValue.producto.id} no encontrado en la lista local. Por favor, recargue la página.`);
      this.isSubmitting = false;
      return;
    }

    console.log('📦 Producto encontrado:', productoActual);

    try {
      switch (payload.tipo_movimiento) {
        case TipoMovimiento.ENTRADA:
        case TipoMovimiento.DEVOLUCION_CLIENTE:
          productoActual.stock = (productoActual.stock || 0) + payload.cantidad;
          break;

        case TipoMovimiento.SALIDA:
        case TipoMovimiento.DEVOLUCION_PROVEEDOR:
          if ((productoActual.stock || 0) < payload.cantidad) {
            throw new Error(`Stock insuficiente para realizar el movimiento. Producto: ${productoActual.nombre}`);
          }
          productoActual.stock = (productoActual.stock || 0) - payload.cantidad;
          break;

        default:
          throw new Error(`Tipo de movimiento no soportado: ${payload.tipo_movimiento}`);
      }
    } catch (error: any) {
      alert(error.message);
      this.isSubmitting = false;
      return;
    }

    // Crear movimiento en backend
    this.movimientoService.create(payload).subscribe({
      next: (movimientoCreado) => {
        // El backend ya devuelve un MovimientoStock completo
        const movimientoCompleto: MovimientoStock = {
          ...movimientoCreado,
          fecha: new Date(movimientoCreado.fecha)
        };
        this.movimientos.unshift(movimientoCompleto);
        this.aplicarFiltros();
        
        // Mostrar mensaje de éxito con el nuevo stock
        const tipoTexto = payload.tipo_movimiento === TipoMovimiento.ENTRADA || payload.tipo_movimiento === TipoMovimiento.DEVOLUCION_CLIENTE ? 'incrementado' : 'decrementado';
        alert(`Movimiento registrado exitosamente. Stock ${tipoTexto}: ${productoActual.stock} unidades`);
        
        this.closeCreateModal();
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('❌ Error al crear movimiento:', err);
        
        // Revertir cambios locales de stock si hubo error
        switch (payload.tipo_movimiento) {
          case TipoMovimiento.ENTRADA:
          case TipoMovimiento.DEVOLUCION_CLIENTE:
            productoActual.stock = (productoActual.stock || 0) - payload.cantidad;
            break;
          case TipoMovimiento.SALIDA:
          case TipoMovimiento.DEVOLUCION_PROVEEDOR:
            productoActual.stock = (productoActual.stock || 0) + payload.cantidad;
            break;
        }
        
        // Mostrar mensaje de error más específico
        let errorMessage = 'Error desconocido al crear el movimiento.';
        
        if (err.status === 404) {
          if (err.error && err.error.includes && err.error.includes('Producto no encontrado')) {
            errorMessage = `Error: El producto con ID ${payload.producto_id} no existe en la base de datos. Por favor, verifique que el producto esté registrado correctamente.`;
          } else {
            errorMessage = 'Error: Endpoint no encontrado. Verifique la configuración del backend.';
          }
        } else if (err.status === 400) {
          errorMessage = 'Error: Datos inválidos en la solicitud. Verifique los valores ingresados.';
        } else if (err.status === 500) {
          errorMessage = 'Error interno del servidor. Contacte al administrador del sistema.';
        } else if (err.status === 0) {
          errorMessage = 'Error: No se puede conectar con el backend. Verifique que esté funcionando.';
        } else {
          errorMessage = `Error ${err.status}: ${err.message || 'Error desconocido'}`;
        }
        
        alert(errorMessage);
        this.isSubmitting = false;
      }
    });
  }

  aplicarFiltros() {
    const desde = this.fechaDesde ? new Date(this.fechaDesde) : null;
    const hasta = this.fechaHasta ? new Date(this.fechaHasta) : null;

    this.movimientosFiltrados = this.movimientos.filter(mv => {
      if (this.filtroTipo && mv.tipo_movimiento !== this.filtroTipo) return false;
      if (desde && mv.fecha < desde) return false;
      if (hasta && mv.fecha > hasta) return false;
      if (this.filtroProducto && !mv.producto.nombre.toLowerCase().includes(this.filtroProducto.toLowerCase())) return false;
      return true;
    });
  }

  // Obtener el stock del producto seleccionado
  getSelectedProductStock(): number {
    const selectedProduct = this.form.get('producto')?.value;
    return selectedProduct?.stock || 0;
  }

  // Verificar si hay stock suficiente para movimientos de salida
  isStockSufficient(): boolean {
    const tipoMovimiento = this.form.get('tipo_movimiento')?.value;
    const cantidad = this.form.get('cantidad')?.value || 0;
    const stockDisponible = this.getSelectedProductStock();

    // Solo validar stock para movimientos de salida
    if (tipoMovimiento === TipoMovimiento.SALIDA || tipoMovimiento === TipoMovimiento.DEVOLUCION_PROVEEDOR) {
      return stockDisponible >= cantidad;
    }

    // Para entradas y devoluciones de clientes, siempre es suficiente
    return true;
  }

  // Calcular el stock resultante después del movimiento
  getResultingStock(): number {
    const tipoMovimiento = this.form.get('tipo_movimiento')?.value;
    const cantidad = this.form.get('cantidad')?.value || 0;
    const stockActual = this.getSelectedProductStock();

    if (tipoMovimiento === TipoMovimiento.ENTRADA || tipoMovimiento === TipoMovimiento.DEVOLUCION_CLIENTE) {
      return stockActual + cantidad;
    } else if (tipoMovimiento === TipoMovimiento.SALIDA || tipoMovimiento === TipoMovimiento.DEVOLUCION_PROVEEDOR) {
      return stockActual - cantidad;
    }

    return stockActual;
  }

  // Verificar si el formulario se puede enviar
  canSubmit(): boolean {
    return this.form.valid && this.isStockSufficient();
  }
}
