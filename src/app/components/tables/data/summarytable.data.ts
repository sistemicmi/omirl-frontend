let windDisplayedColumns: string[] = [
  'description',
  'max',
  'stationMax',
  'gust',
  'stationGust',
];

let windDisplayedNames: any = {
  description: 'Zona',
  max: 'Max (Km/h)',
  stationMax: 'Nella stazione',
  gust: 'Raffica (Km/h)',
  stationGust: 'Nella stazione',
};

let temperatureDisplayedColumns: string[] = [
  'description',
  'min',
  'stationMin',
  'max',
  'stationMax',
];

let temperatureDisplayedNamesByArea: any = {
  description: 'Area allertamento',
  min: 'Min T (°C)',
  stationMin: 'Nella stazione',
  max: 'Max T (°C)',
  stationMax: 'Nella stazione',
};

let temperatureDisplayedNamesByCity: any = {
  description: 'Città',
  min: 'Min T (°C)',
  stationMin: 'Nella stazione',
  max: 'Max T (°C)',
  stationMax: 'Nella stazione',
};

export let displayedColumns: string[][] = [
  temperatureDisplayedColumns,
  windDisplayedColumns,
];

export let displayedNames: any[] = [
  temperatureDisplayedNamesByCity,
  temperatureDisplayedNamesByArea,
  windDisplayedNames,
];
