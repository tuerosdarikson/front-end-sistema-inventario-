import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from "../../components/sidebar/sidebar";
import { FooterComponent } from "../../components/footer/footer";

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [RouterOutlet, Sidebar, FooterComponent],
  templateUrl: './pages.html',
  styleUrl: './pages.css'
})
export class PagesLayout {

}
