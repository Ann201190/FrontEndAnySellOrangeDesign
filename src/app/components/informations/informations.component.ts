import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-informations',
  templateUrl: './informations.component.html',
  styleUrls: ['./informations.component.css']
})
export class InformationsComponent implements OnInit {

  constructor(
    public translateService: TranslateService,
    private storage: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.translateService.use(this.storage.getItem('lang'))
  }

}
