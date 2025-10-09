import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from "../../components/sidebar/sidebar";

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [RouterOutlet, Sidebar],
  templateUrl: './pages.html',
  styleUrl: './pages.css'
})
export class PagesLayout {

}
