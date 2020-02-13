interface Sattelite {
  name: string;
  id: number;
  position: Position;
  velocity?: number;
  visibility: string;
  footprint?: number;
  timestamp?: number;
  daynum?: number;
  solar_lat?: number;
  solar_lon?: number;
  units?: number;
}
