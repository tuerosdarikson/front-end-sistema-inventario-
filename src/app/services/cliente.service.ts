import {HttpClient} from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Cliente } from "@interfaces/cliente";


@Injectable({
  providedIn: "root",
})
export class ClienteService {
    private http = inject(HttpClient);

    list(){
        return this.http.get<Cliente[]>('http://localhost:8080/api/clientes/query');
    }

    get(id: number){
        return this.http.get<Cliente>(`http://localhost:8080/api/clientes/query/${id}`);
    }
  getByDocumento(documentoIdentidad: string) {
    return this.http.get<Cliente>(
      `http://localhost:8080/api/clientes/query/documento?documentoIdentidad=${documentoIdentidad}`
    );
  }

  getByRuc(rucEmpresa: string) {
    return this.http.get<Cliente>(
      `http://localhost:8080/api/clientes/query/ruc?rucEmpresa=${rucEmpresa}`
    );
  }

  getByTipo(tipoCliente: string) {
    return this.http.get<Cliente[]>(
      `http://localhost:8080/api/clientes/query/tipo?tipoCliente=${tipoCliente}`
    );
  }

    create(clientes:Cliente){
        return this.http.post<Cliente>('http://localhost:8080/api/clientes/command', clientes);
    }

    update(id:number, clientes:Cliente){
        return this.http.put<Cliente>(`http://localhost:8080/api/clientes/command/${id}`, clientes);
    }

    delete(id:number){
        return this.http.delete<void>(`http://localhost:8080/api/clientes/command/${id}`);
    }
}