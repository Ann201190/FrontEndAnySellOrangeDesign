import { Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css']
})
export class QRCodeComponent implements OnInit {

  public myAngularxQrCode: string = "";
  constructor(
    public storage: LocalStorageService
  ) {
  }

  ngOnInit(): void {
    this.myAngularxQrCode = this.storage.getItem('qrcode');
  }

}


