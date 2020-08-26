import { Component, OnInit } from "@angular/core";
import { Observable, timer } from "rxjs";
import { filter, distinctUntilChanged } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import * as Leaflet from "leaflet";
import { MapService } from "./map.service";
import { Position } from "./../../core/interfaces/position";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"]
})
export class MapComponent implements OnInit {
  private set position({ latitude, longitude }) {
    this._position = {
      latitude,
      longitude
    };
  }

  private get position(): Position {
    return this._position;
  }

  private set zoomLevel(zoomLevel: number) {
    this._zoomLevel = zoomLevel;
  }

  private get zoomLevel(): number {
    return this._zoomLevel;
  }

  constructor(private mapService: MapService, translate: TranslateService) {
    translate.setDefaultLang("pt-BR");
  }
  private issIconPath = "~/../../../../assets/International_Space_Station.svg";
  private isLockOn = true;
  private isDrawingLine = true;

  private lineColor = "#ff0000"; // HEX OR COLOR NAME
  private iconLayerGroup: any;
  private lineLayerGroup: any;

  private $timer: Observable<any>;
  private _zoomLevel = 4;
  private _position: Position;
  private positions = [];

  private map;

  public changeIsLockOn(): void {
    this.isLockOn = !this.isLockOn;
  }

  public changeIsDrawingLine(): void {
    this.isDrawingLine = !this.isDrawingLine;
  }

  public selectLineColor($event): void {
    this.lineColor = $event && $event.target.value;
  }

  ngOnInit() {
    this.initMap();
    this.getLocation();
    this.setTimer();
    this.updateLocation();
  }

  private initMap(): void {
    this.map = Leaflet.map("map").setView([0, 0], this.zoomLevel);


    const attribution =
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    Leaflet.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution }
    ).addTo(this.map);

    this.lineLayerGroup = Leaflet.layerGroup().addTo(this.map);
    this.iconLayerGroup = Leaflet.layerGroup().addTo(this.map);
  }

  private getLocation(): void {
    this.mapService
      .getIssLocation()
      .pipe(
        distinctUntilChanged(),
        filter(data => !!data)
      )
      .subscribe(({ latitude, longitude }) => {
        this.position = {
          latitude: Number(latitude),
          longitude: Number(longitude)
        };
        if (this.position.latitude && this.position.longitude) {
          this.moveAnimation();
        }
      });
  }

  private moveAnimation(): void {
    this.moveView(this.position, this.isLockOn);
    this.drawLine(this.position);
    this.iconLayerGroup.clearLayers();
    this.drawIcon(this.position);
  }

  private setTimer(): void {
    this.$timer = timer(3000, 2000);
  }

  private drawIcon({ latitude, longitude }): void {
    const issIcon = Leaflet.icon({
      iconUrl: this.issIconPath,
      iconSize: [50, 32],
      iconAnchor: [25, 16]
    });
    Leaflet.marker([latitude, longitude], {
      icon: issIcon,
      click: e => this.iconLayerGroup.fitBounds(e.target.getBounds())
    }).addTo(this.iconLayerGroup);
  }

  private moveView(
    { latitude, longitude },
    isLock?: boolean,
    zoomLevel?: number
  ): void {
    const isLockOn = isLock || this.isLockOn;
    if (isLockOn) {
      this.map.panTo([latitude, longitude], zoomLevel);
    }
  }

  private updateLocation(): void {
    this.$timer.subscribe(() => this.getLocation());
  }

  private drawLine({ latitude, longitude }, isDrawing?: boolean): void {
    const isDrawingLine = isDrawing || this.isDrawingLine;
    if (isDrawingLine) {
      this.positions.push([latitude, longitude]);
      Leaflet.polyline(this.positions, { color: this.lineColor }).addTo(
        this.lineLayerGroup
      );
    }
  }
}
