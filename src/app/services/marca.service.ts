import {HttpClient} from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Marca } from "@interfaces/marca";


@Injectable({
  providedIn: "root",
})
export class MarcaService {
    private http = inject(HttpClient);

    list(){
        return this.http.get<Marca[]>('http://localhost:8080/api/marcas/query');
    }

    get(id: number){
        return this.http.get<Marca>(`http://localhost:8080/api/marcas/query/${id}`);
    }

    create(marcas:Marca){
        return this.http.post<Marca>('http://localhost:8080/api/marcas/command', marcas);
    }

    update(id:number, marcas:Marca){
        return this.http.put<Marca>(`http://localhost:8080/api/marcas/command/${id}`, marcas);
    }

    delete(id:number){
        return this.http.delete<void>(`http://localhost:8080/api/marcas/command/${id}`);
    }
}