import { Component, OnInit } from '@angular/core';

// Jquery
declare var $: any;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    $('[data-widget="treeview"]').Treeview('init');
    var ultimoClic = new Date();
    localStorage.setItem('ultimoClic', ultimoClic.getTime().toString());

  }

}