import {HttpClient} from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Categoria } from "@interfaces/categoria";


@Injectable({
  providedIn: "root",
})
export class CategoriaService {
    private http = inject(HttpClient);

    list(){
        return this.http.get<Categoria[]>('http://localhost:8080/api/categorias/query');
    }

    get(id: number){
        return this.http.get<Categoria>(`http://localhost:8080/api/categorias/query/${id}`);
    }

    create(categorias:Categoria){
        return this.http.post<Categoria>('http://localhost:8080/api/categorias/command', categorias);
    }

    update(id:number, categorias:Categoria){
        return this.http.put<Categoria>(`http://localhost:8080/api/categorias/command/${id}`, categorias);
    }

    delete(id:number){
        return this.http.delete<void>(`http://localhost:8080/api/categorias/command/${id}`);
    }
}