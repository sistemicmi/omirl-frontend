import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  menuTranslations: { [key: string]: string } = {};

  constructor() {
    //#region sensori
    this.menuTranslations[
      'OMIRLCONFIG_SENSORPLUVIO'
    ] = $localize`:@@OMIRLCONFIG_SENSORPLUVIO:Precipitazione`;
    this.menuTranslations[
      'OMIRLCONFIG_SENSORPLUVIONATIVE'
    ] = $localize`:@@OMIRLCONFIG_SENSORPLUVIONATIVE:Precipitazione nativa`;
    this.menuTranslations[
      'OMIRLCONFIG_SENSORPLUVIO7'
    ] = $localize`:@@OMIRLCONFIG_SENSORPLUVIO7:Precipitazione 7gg`;
    this.menuTranslations[
      'OMIRLCONFIG_SENSORPLUVIOMESE'
    ] = $localize`:@@OMIRLCONFIG_SENSORPLUVIOMESE:Precipitazione 30gg`;
    this.menuTranslations[
      'OMIRLCONFIG_SENSORTERMO'
    ] = $localize`:@@OMIRLCONFIG_SENSORTERMO:Temperatura`;
    this.menuTranslations[
      'OMIRLCONFIG_SENSORIDRO'
    ] = $localize`:@@OMIRLCONFIG_SENSORIDRO:Livelli idrometrici`;
    this.menuTranslations[
      'OMIRLCONFIG_SENSORWIND'
    ] = $localize`:@@OMIRLCONFIG_SENSORWIND:Vento`;
    this.menuTranslations[
      'OMIRLCONFIG_SENSORIGRO'
    ] = $localize`:@@OMIRLCONFIG_SENSORIGRO:Umidità dell'aria`;
    this.menuTranslations[
      'OMIRLCONFIG_SENSORELIO'
    ] = $localize`:@@OMIRLCONFIG_SENSORELIO:Eliofanie`;
    this.menuTranslations[
      'OMIRLCONFIG_SENSORRADIO'
    ] = $localize`:@@OMIRLCONFIG_SENSORRADIO:Radiazione solare`;
    this.menuTranslations[
      'OMIRLCONFIG_SENSORFOGLIE'
    ] = $localize`:@@OMIRLCONFIG_SENSORFOGLIE:Bagnatura fogliare`;
    this.menuTranslations[
      'OMIRLCONFIG_SENSORPRESS'
    ] = $localize`:@@OMIRLCONFIG_SENSORPRESS:Pressione atmosferica`;
    this.menuTranslations[
      'OMIRLCONFIG_SENSORBOA'
    ] = $localize`:@@OMIRLCONFIG_SENSORBOA:Stato del mare`;
    this.menuTranslations[
      'OMIRLCONFIG_SENSORNEVE'
    ] = $localize`:@@OMIRLCONFIG_SENSORNEVE:Neve`;
    this.menuTranslations[
      'OMIRLCONFIG_SENSORFULMINI'
    ] = $localize`:@@OMIRLCONFIG_SENSORFULMINI:Fulminazioni`;
    this.menuTranslations[
      'OMIRLCONFIG_SENSORWEBCAM'
    ] = $localize`:@@OMIRLCONFIG_SENSORWEBCAM:Webcam`;
    this.menuTranslations[
      'OMIRLCONFIG_SENSORBATT'
    ] = $localize`:@@OMIRLCONFIG_SENSORBATT:Tensione batteria`;

    //#endregion sensori

    //#region mappe
    this.menuTranslations[
      'OMIRLCONFIG_MAPPIOGGIA'
    ] = $localize`:@@OMIRLCONFIG_MAPPIOGGIA:Pioggia`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPUMIDITASUOLO'
    ] = $localize`:@@OMIRLCONFIG_MAPUMIDITASUOLO:Umidità del suolo`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPTEMPERATURA'
    ] = $localize`:@@OMIRLCONFIG_MAPTEMPERATURA:Temperatura`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPPIOGGIAULTIMI15'
    ] = $localize`:@@OMIRLCONFIG_MAPPIOGGIAULTIMI15:Ultimi 15'`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPPIOGGIAULTIMI30'
    ] = $localize`:@@OMIRLCONFIG_MAPPIOGGIAULTIMI30:Ultimi 30'`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPPIOGGIAULTIMAORA'
    ] = $localize`:@@OMIRLCONFIG_MAPPIOGGIAULTIMAORA:Ultima ora`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPPIOGGIAULTIME3ORE'
    ] = $localize`:@@OMIRLCONFIG_MAPPIOGGIAULTIME3ORE:Ultime 3 ore`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPPIOGGIAULTIME6ORE'
    ] = $localize`:@@OMIRLCONFIG_MAPPIOGGIAULTIME6ORE:Ultime 6 ore`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPPIOGGIAULTIME12ORE'
    ] = $localize`:@@OMIRLCONFIG_MAPPIOGGIAULTIME12ORE:Ultime 12 ore`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPPIOGGIAULTIME24ORE'
    ] = $localize`:@@OMIRLCONFIG_MAPPIOGGIAULTIME24ORE:Ultime 24 ore`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPPIOGGIAULTIMI7G'
    ] = $localize`:@@OMIRLCONFIG_MAPPIOGGIAULTIMI7G:Ultimi 7 Giorni`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPPIOGGIAULTIMI15G'
    ] = $localize`:@@OMIRLCONFIG_MAPPIOGGIAULTIMI15G:Ultimi 15 Giorni`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPPIOGGIAULTIMI30G'
    ] = $localize`:@@OMIRLCONFIG_MAPPIOGGIAULTIMI30G:Ultimi 30 Giorni`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPUMIDITASUOLO00'
    ] = $localize`:@@OMIRLCONFIG_MAPUMIDITASUOLO00:Stato alle 00:00`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPUMIDITASUOLO06'
    ] = $localize`:@@OMIRLCONFIG_MAPUMIDITASUOLO06:Stato alle 06:00`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPUMIDITASUOLO12'
    ] = $localize`:@@OMIRLCONFIG_MAPUMIDITASUOLO12:Stato alle 12:00`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPUMIDITASUOLO18'
    ] = $localize`:@@OMIRLCONFIG_MAPUMIDITASUOLO18:Stato alle 18:00`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPTEMPERATURAMIN'
    ] = $localize`:@@OMIRLCONFIG_MAPTEMPERATURAMIN:Temperatura - Minima`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPTEMPERATURAMED'
    ] = $localize`:@@OMIRLCONFIG_MAPTEMPERATURAMED:Temperatura - Media`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPTEMPERATURAMAX'
    ] = $localize`:@@OMIRLCONFIG_MAPTEMPERATURAMAX:Temperatura - Massima`;
    this.menuTranslations[
      'OMIRLCONFIG_MAPTEMPERATURATHETAMEDIA'
    ] = $localize`:@@OMIRLCONFIG_MAPTEMPERATURATHETAMEDIA:Temperatura - Theta da Media`;
    this.menuTranslations[
      'OMIRLCONFIG_INTERPOLATA'
    ] = $localize`:@@OMIRLCONFIG_INTERPOLATA:Interpolata`;
    //#endregion mappe

    //#region stratiinfo
    this.menuTranslations[
      'OMIRLCONFIG_RETICOLO'
    ] = $localize`:@@OMIRLCONFIG_RETICOLO:Reticolo Idrografico`;
    this.menuTranslations[
      'OMIRLCONFIG_BACINI'
    ] = $localize`:@@OMIRLCONFIG_BACINI:Bacini Idrografici`;
    this.menuTranslations[
      'OMIRLCONFIG_COMUNI'
    ] = $localize`:@@OMIRLCONFIG_COMUNI:Comuni`;
    this.menuTranslations[
      'OMIRLCONFIG_PROVINCE'
    ] = $localize`:@@OMIRLCONFIG_PROVINCE:Province`;
    this.menuTranslations[
      'OMIRLCONFIG_AREE'
    ] = $localize`:@@OMIRLCONFIG_AREE:Zone di Allerta`;
    this.menuTranslations[
      'OMIRLCONFIG_COMPRIDROBASE'
    ] = $localize`:@@OMIRLCONFIG_COMPRIDROBASE:Comprensori idrologici di base`;
    this.menuTranslations[
      'OMIRLCONFIG_AREEINOND_3050'
    ] = $localize`:@@OMIRLCONFIG_AREEINOND_3050:Aree Inondabili Tr 30-50 Anni`;
    this.menuTranslations[
      'OMIRLCONFIG_AREEINOND_200'
    ] = $localize`:@@OMIRLCONFIG_AREEINOND_200:Aree Inondabili Tr 200 Anni`;
    this.menuTranslations[
      'OMIRLCONFIG_AREEINOND_500'
    ] = $localize`:@@OMIRLCONFIG_AREEINOND_500:Aree Inondabili Tr 500 Anni`;
    this.menuTranslations[
      'OMIRLCONFIG_ELEMESPOSTI'
    ] = $localize`:@@OMIRLCONFIG_ELEMESPOSTI:Esposti al rischio inondazione`;
    /*this.menuTranslations[
      'OMIRLCONFIG_DIGHE'
    ] = $localize`:@@OMIRLCONFIG_DIGHE:Grandi Dighe di Interesse Ligure`;*/
    //#endregion stratiinfo

    //#region charts
    this.menuTranslations[
      'DAEMON_RAIN1H'
    ] = $localize`:@@DAEMON_RAIN1H:Pioggia 1h`;
    this.menuTranslations[
      'DAEMON_RAIN1HCUM'
    ] = $localize`:@@DAEMON_RAIN1HCUM:Pioggia Oraria Cumulata`;
    this.menuTranslations[
      'DAEMON_PIOGGIA5MYAXIS'
    ] = $localize`:@@DAEMON_PIOGGIA5MYAXIS:Pioggia 5m (mm)`;
    this.menuTranslations[
      'DAEMON_CUMULATAYAXIS'
    ] = $localize`:@@DAEMON_CUMULATAYAXIS:Precipitazione Cumulata (mm)`;
    this.menuTranslations[
      'DAEMON_PIOGGIA10MYAXIS'
    ] = $localize`:@@DAEMON_PIOGGIA10MYAXIS:Pioggia 10m (mm)`;
    this.menuTranslations[
      'DAEMON_PIOGGIA15MYAXIS'
    ] = $localize`:@@DAEMON_PIOGGIA15MYAXIS:Pioggia 15m (mm)`;
    this.menuTranslations[
      'DAEMON_PIOGGIA30MYAXIS'
    ] = $localize`:@@DAEMON_PIOGGIA30MYAXIS:Pioggia 30m (mm)`;
    this.menuTranslations[
      'DAEMON_PIOGGIAORAMYAXIS'
    ] = $localize`:@@DAEMON_PIOGGIAORAMYAXIS:Pioggia Oraria (mm)`;
    this.menuTranslations[
      'DAEMON_TEMPERATURA'
    ] = $localize`:@@DAEMON_TEMPERATURA:Temperatura`;
    this.menuTranslations[
      'DAEMON_TEMPERATURAYAXIS'
    ] = $localize`:@@DAEMON_TEMPERATURAYAXIS:Temperatura (°C)`;
    this.menuTranslations[
      'DAEMON_TEMPERATURAMIN'
    ] = $localize`:@@DAEMON_TEMPERATURAMIN:Temperatura Minima`;
    this.menuTranslations[
      'DAEMON_TEMPERATURAMINYAXIS'
    ] = $localize`:@@DAEMON_TEMPERATURAMINYAXIS:Temperatura Minima :(°C)`;
    this.menuTranslations[
      'DAEMON_TEMPERATURAMAX'
    ] = $localize`:@@DAEMON_TEMPERATURAMAX:Temperatura Massima`;
    this.menuTranslations[
      'DAEMON_TEMPERATURAMAXYAXIS'
    ] = $localize`:@@DAEMON_TEMPERATURAMAXYAXIS:Temperatura Massima (°C)`;
    this.menuTranslations[
      'DAEMON_LIVIDRO'
    ] = $localize`:@@DAEMON_LIVIDRO:Livello Idrometrico`;
    this.menuTranslations[
      'DAEMON_LIVIDROYAXIS'
    ] = $localize`:@@DAEMON_LIVIDROYAXIS:Livello Idrometrico (m)`;
    this.menuTranslations['D:AEMON_VENTO'] = $localize`:@@DAEMON_VENTO:Vento`;
    this.menuTranslations[
      'DAEMON_VELOCITAVENTOYAXIS'
    ] = $localize`:@@DAEMON_VELOCITAVENTOYAXIS:Velocita' (km/h)`;
    this.menuTranslations[
      'DAEMON_VELOCITAVENTO2G'
    ] = $localize`:@@DAEMON_VELOCITAVENTO2G:Velocita' (km/h)`;
    this.menuTranslations[
      'DAEMON_RAFFICA'
    ] = $localize`:@@DAEMON_RAFFICA:Raffica`;
    this.menuTranslations[
      'DAEMON_RAFFICAYAXIS'
    ] = $localize`:@@DAEMON_RAFFICAYAXIS:Raffica (km/h)`;
    this.menuTranslations[
      'DAEMON_RAFFICA2GYAXIS'
    ] = $localize`:@@DAEMON_RAFFICA2GYAXIS:Raffica (km/h)`;
    this.menuTranslations[
      'DAEMON_UMIDITA'
    ] = $localize`:@@DAEMON_UMIDITA:Umidita'`;
    this.menuTranslations[
      'DAEMON_UMIDITAYAXIS'
    ] = $localize`:@@DAEMON_UMIDITAYAXIS:Umidita' Relativa (%)`;
    this.menuTranslations[
      'DAEMON_RADIO'
    ] = $localize`:@@DAEMON_RADIO:Radiometri`;
    this.menuTranslations[
      'DAEMON_RADIAZIONEYAXIS'
    ] = $localize`:@@DAEMON_RADIAZIONEYAXIS:Radiazione (W/m2)`;
    this.menuTranslations[
      'DAEMON_SUNSHINE'
    ] = $localize`:@@DAEMON_SUNSHINE:Eliofania`;
    this.menuTranslations[
      'DAEMON_SUNSHINEDURATIONYAXIS'
    ] = $localize`:@@DAEMON_SUNSHINEDURATIONYAXIS:Eliofania (%)`;
    this.menuTranslations[
      'DAEMON_BAGNATURAYAXIS'
    ] = $localize`:@@DAEMON_BAGNATURAYAXIS:Bagnatura Fogliare (%)`;
    this.menuTranslations[
      'DAEMON_BAGNATURAPERC'
    ] = $localize`:@@DAEMON_BAGNATURAPERC:Percentuale Bagnatura :Fogliare`;
    this.menuTranslations[
      'DAEMON_PRESSIONE'
    ] = $localize`:@@DAEMON_PRESSIONE:Pressione al livello del mare`;
    this.menuTranslations[
      'DAEMON_PRESSIONEYAXIS'
    ] = $localize`:@@DAEMON_PRESSIONEYAXIS:Pressione al :livello del mare (hPa)`;
    this.menuTranslations[
      'DAEMON_TENSIONE'
    ] = $localize`:@@DAEMON_TENSIONE:Tensione Batteria`;
    this.menuTranslations[
      'DAEMON_TENSIONEYAXIS'
    ] = $localize`:@@DAEMON_TENSIONEYAXIS:Tensione Batteria (V)`;
    this.menuTranslations[
      'DAEMON_SEASTATUS'
    ] = $localize`:@@DAEMON_SEASTATUS:Stato del Mare`;
    this.menuTranslations[
      'DAEMON_LUNGHEZZAMEDIAONDAYAXIS'
    ] = $localize`:@@DAEMON_LUNGHEZZAMEDIAONDAYAXIS:Altezza Media Onda(m)`;
    this.menuTranslations['DAEMON_NEVE'] = $localize`:@@DAEMON_NEVE:Neve`;
    this.menuTranslations[
      'DAEMON_ALTEZZANEVEYAXIS'
    ] = $localize`:@@DAEMON_ALTEZZANEVEYAXIS:Altezza di Neve (cm)`;
    this.menuTranslations[
      'DAEMON_RAIN30G'
    ] = $localize`:@@DAEMON_RAIN30G:Pioggia Mensile`;
    this.menuTranslations[
      'DAEMON_RAIN30GCUM'
    ] = $localize`:@@DAEMON_RAIN30GCUM:Pioggia Mensile Cumulata`;
    this.menuTranslations[
      'DAEMON_PIOGGIA30GYAXIS'
    ] = $localize`:@@DAEMON_PIOGGIA30GYAXIS:Pioggia 1gg :(mm)`;
    this.menuTranslations[
      'DAEMON_RAIN7G'
    ] = $localize`:@@DAEMON_RAIN7G:Pioggia Settimanale`;
    this.menuTranslations[
      'DAEMON_RAIN7GCUM'
    ] = $localize`:@@DAEMON_RAIN7GCUM:Pioggia Settimanale Cumulata`;
    this.menuTranslations[
      'DAEMON_PIOGGIA7GYAXIS'
    ] = $localize`:@@DAEMON_PIOGGIA7GYAXIS:Pioggia 7gg (mm)`;

    //#endregion charts

    //#region hydro

    this.menuTranslations[
      'OMIRLCONFIG_HYDROMODELMONITORING'
    ] = $localize`:@@OMIRLCONFIG_HYDROMODELMONITORING:Modelli Idro Monitoraggio`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROMODELPREV'
    ] = $localize`:@@OMIRLCONFIG_HYDROMODELPREV:Modelli Idro Previsione`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROMAGRAQ'
    ] = $localize`:@@OMIRLCONFIG_HYDROMAGRAQ:Run MIKE Osservato Magra Q`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROMAGRAH'
    ] = $localize`:@@OMIRLCONFIG_HYDROMAGRAH:Run MIKE Osservato Magra H`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROMAGRANOWCASTING'
    ] = $localize`:@@OMIRLCONFIG_HYDROMAGRANOWCASTING:Nowcastinghydro`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROMAGRAOSSERVATO10'
    ] = $localize`:@@OMIRLCONFIG_HYDROMAGRAOSSERVATO10:Simulato Osservato 10 min`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROMAGRAOSSERVATO60'
    ] = $localize`:@@OMIRLCONFIG_HYDROMAGRAOSSERVATO60:Simulato Osservato`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROOSSERVATODIGHE60'
    ] = $localize`:@@OMIRLCONFIG_HYDROOSSERVATODIGHE60:Simulato Osservato Dighe`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROMAGRAOSSERVATO'
    ] = $localize`:@@OMIRLCONFIG_HYDROMAGRAOSSERVATO:Monitoraggio Osservato`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPICCOLIBACINI'
    ] = $localize`:@@OMIRLCONFIG_HYDROPICCOLIBACINI:Piccoli Bacini`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDRO_OSS'
    ] = $localize`:@@OMIRLCONFIG_HYDRO_OSS:Osservato`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDRO_OSS_PHAST'
    ] = $localize`:@@OMIRLCONFIG_HYDRO_OSS_PHAST:Osservato + Phast`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVDET'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVDET:Previsione Deterministica`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVSOGG'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVSOGG:Previsione Soggettiva`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVSOGG_AUTO'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVSOGG_AUTO:Previsione Soggettiva Automatica`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVSOGG_AUTO00'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVSOGG_AUTO00:Soggettiva Automatica 00`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVSOGG_AUTO_00'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVSOGG_AUTO_00:Previsione Soggettiva Automatica 00`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVSOGG_AUTO+06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVSOGG_AUTO+06:Soggettiva Automatica +06`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVSOGG_AUTO_+06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVSOGG_AUTO_+06:Previsione Soggettiva Automatica +06`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVSOGG_AUTO-06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVSOGG_AUTO-06:Soggettiva Automatica -06`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVSOGG_AUTO_-06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVSOGG_AUTO_-06:Previsione Soggettiva Automatica -06`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVSOGG_AUTO+12'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVSOGG_AUTO+12:Soggettiva Automatica +12`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVSOGG_AUTO_+12'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVSOGG_AUTO_+12:Previsione Soggettiva Automatica +12`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMAGRAQ'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMAGRAQ:Run MIKE Previsto Magra Q`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVROJAQ'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVROJAQ:Nowcastinghydro Roja Q`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMAGRAH'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMAGRAH:Run MIKE Previsto Magra H`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM:Previsione Bolam`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM00'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM00:Bolam 00`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM_00'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM_00:Previsione Bolam 00`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM+06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM+06:Bolam +06`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM_+06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM_+06:Previsione Bolam +06`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM-06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM-06:Bolam -06`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM_-06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM_-06:Previsione Bolam -06`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM+12'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM+12:Bolam +12`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM_+12'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM_+12:Previsione Bolam +12`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM10+00'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM10+00:Bolam10 00"`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM10_+00'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM10_+00:Previsione Bolam10 00"`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM10+06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM10+06:Bolam10 +06"`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM10_+06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM10_+06:Previsione Bolam10 +06"`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM10-06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM10-06:Bolam10 -06"`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM10_-06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM10_-06:Previsione Bolam10 -06"`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM10+12'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM10+12:Bolam10 +12"`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM10_+12'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM10_+12:Previsione Bolam10 +12"`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM08+00'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM08+00:Bolam08 00"`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM08_+00'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM08_+00:Previsione Bolam08 00"`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM08+06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM08+06:Bolam08 +06"`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM08_+06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM08_+06:Previsione Bolam08 +06"`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM08-06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM08-06:Bolam08 -06"`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM08_-06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM08_-06:Previsione Bolam08 -06"`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM08+12'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM08+12:Bolam08 +12"`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVBOLAM08_+12'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVBOLAM08_+12:Previsione Bolam08 +12"`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH:Previsione Moloch`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH00'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH00:Moloch 00`;

    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH02+00'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH02+00:Moloch02 00`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH02_+00'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH02_+00:Previsione Moloch02 00`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH02+06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH02+06:Moloch02 +06`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH02_+06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH02_+06:Previsione Moloch02 +06`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH02-06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH02-06:Moloch02 -06`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH02_-06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH02_-06:Previsione Moloch02 -06`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH02+12'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH02+12:Moloch02 +12`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH02_+12'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH02_+12:Previsione Moloch02 +12`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH15+00'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH15+00:Moloch1.5 00`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH15_+00'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH15_+00:Previsione Moloch1.5 00`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH15+06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH15+06:Moloch1.5 +06`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH15_+06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH15_+06:Previsione Moloch1.5 +06`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH15-06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH15-06:Moloch1.5 -06`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH15_-06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH15_-06:Previsione Moloch1.5 -06`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH15+12'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH15+12:Moloch1.5 +12`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH15_+12'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH15_+12:Previsione Moloch1.5 +12`;

    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH_00'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH_00:Previsione Moloch 00`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH+06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH+06:Moloch +06`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH_+06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH_+06:Previsione Moloch +06`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH-06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH-06:Moloch -06`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH_-06'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH_-06:Previsione Moloch -06`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH+12'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH+12:Moloch +12`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVMOLOCH_+12'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVMOLOCH_+12:Previsione Moloch +12`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVLAMI'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVLAMI:Previsione Local`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVLAMI500'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVLAMI500:Lami 5 00`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVLAMI5_00'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVLAMI5_00:Previsione Lami 5 00`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVLAMI5+12'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVLAMI5+12:Lami 5 +12`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVLAMI5_+12'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVLAMI5_+12:Previsione Lami 5 +12`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVLAMI2200'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVLAMI2200:Lami 2.2 00`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVLAMI22_00'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVLAMI22_00:Previsione Lami 2.2 00`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVLAMI22+12'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVLAMI22+12:Lami 2.2 +12`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVLAMI22_+12'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVLAMI22_+12:Previsione Lami 2.2 +12`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVLAMI700'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVLAMI700:Lami 7 00`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVLAMI7_00'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVLAMI7_00:Previsione Lami 7 00`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVLAMI7+12'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVLAMI7+12:Lami 7 +12`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVLAMI7_+12'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVLAMI7_+12:Previsione Lami 7 +12`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVLAMI2800'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVLAMI2800:Lami 2.8 00`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVLAMI28_00'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVLAMI28_00:Previsione Lami 2.8 00`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVLAMI28+12'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVLAMI28+12:Lami 2.8 +12`;
    this.menuTranslations[
      'OMIRLCONFIG_HYDROPREVLAMI28_+12'
    ] = $localize`:@@OMIRLCONFIG_HYDROPREVLAMI28_+12:Previsione Lami 2.8 +12`;

    //#endregion hydro

    //#region radar

    this.menuTranslations[
      'OMIRLCONFIG_RADAR5m'
    ] = $localize`:@@OMIRLCONFIG_RADAR5m:Intensita' oraria`;
    this.menuTranslations[
      'OMIRLCONFIG_RADAR10m'
    ] = $localize`:@@OMIRLCONFIG_RADAR10m:Cumulata 10m`;
    this.menuTranslations[
      'OMIRLCONFIG_RADARINT1h'
    ] = $localize`:@@OMIRLCONFIG_RADARINT1h:Cumulata oraria`;
    this.menuTranslations[
      'OMIRLCONFIG_RADAR1h'
    ] = $localize`:@@OMIRLCONFIG_RADAR1h:Cumulata oraria`;
    this.menuTranslations[
      'OMIRLCONFIG_RADAR_DPCN'
    ] = $localize`:@@OMIRLCONFIG_RADAR_DPCN:Radar D.P.C.N.`;
    this.menuTranslations[
      'OMIRLCONFIG_RADAR1hSTAZIONI'
    ] = $localize`:@@OMIRLCONFIG_RADAR1hSTAZIONI:Radar 1h + Stazioni`;
    this.menuTranslations[
      'OMIRLCONFIG_RADARWORSTCASE'
    ] = $localize`:@@OMIRLCONFIG_RADARWORSTCASE:Worst Case`;
    this.menuTranslations[
      'OMIRLCONFIG_RADARWORSTCASE_10'
    ] = $localize`:@@OMIRLCONFIG_RADARWORSTCASE_10:Worst Scenario 10 Min`;
    this.menuTranslations[
      'OMIRLCONFIG_RADARWORSTCASE_20'
    ] = $localize`:@@OMIRLCONFIG_RADARWORSTCASE_20:Worst Scenario 20 Min`;
    this.menuTranslations[
      'OMIRLCONFIG_RADARWORSTCASE_30'
    ] = $localize`:@@OMIRLCONFIG_RADARWORSTCASE_30:Worst Scenario 30 Min`;
    this.menuTranslations[
      'OMIRLCONFIG_RADARWORSTCASE_40'
    ] = $localize`:@@OMIRLCONFIG_RADARWORSTCASE_40:Worst Scenario 40 Min`;
    this.menuTranslations[
      'OMIRLCONFIG_RADARWORSTCASE_50'
    ] = $localize`:@@OMIRLCONFIG_RADARWORSTCASE_50:Worst Scenario 50 Min`;
    this.menuTranslations[
      'OMIRLCONFIG_RADARWORSTCASE_60'
    ] = $localize`:@@OMIRLCONFIG_RADARWORSTCASE_60:Worst Scenario 60 Min`;
    this.menuTranslations[
      'OMIRLCONFIG_RADARWORSTCASE_70'
    ] = $localize`:@@OMIRLCONFIG_RADARWORSTCASE_70:Worst Scenario 70 Min`;
    this.menuTranslations[
      'OMIRLCONFIG_RADARWORSTCASE_80'
    ] = $localize`:@@OMIRLCONFIG_RADARWORSTCASE_80:Worst Scenario 80 Min`;
    this.menuTranslations[
      'OMIRLCONFIG_RADARWORSTCASE_90'
    ] = $localize`:@@OMIRLCONFIG_RADARWORSTCASE_90:Worst Scenario 90 Min`;
    this.menuTranslations[
      'OMIRLCONFIG_RADARWORSTCASE_100'
    ] = $localize`:@@OMIRLCONFIG_RADARWORSTCASE_100:Worst Scenario 100 Min`;
    this.menuTranslations[
      'OMIRLCONFIG_RADARNOWCASTING'
    ] = $localize`:@@OMIRLCONFIG_RADARNOWCASTING:NowCasting - Probabilità superamento soglie`;
    this.menuTranslations[
      'OMIRLCONFIG_RADARNOWCASTING_10'
    ] = $localize`:@@OMIRLCONFIG_RADARNOWCASTING_10:Prob2thr 10 Min`;
    this.menuTranslations[
      'OMIRLCONFIG_RADARNOWCASTING_20'
    ] = $localize`:@@OMIRLCONFIG_RADARNOWCASTING_20:Prob2thr 20 Min`;
    this.menuTranslations[
      'OMIRLCONFIG_RADARNOWCASTING_30'
    ] = $localize`:@@OMIRLCONFIG_RADARNOWCASTING_30:Prob2thr 30 Min`;
    this.menuTranslations[
      'OMIRLCONFIG_RADARNOWCASTING_40'
    ] = $localize`:@@OMIRLCONFIG_RADARNOWCASTING_40:Prob2thr 40 Min`;
    this.menuTranslations[
      'OMIRLCONFIG_RADARNOWCASTING_50'
    ] = $localize`:@@OMIRLCONFIG_RADARNOWCASTING_50:Prob2thr 50 Min`;
    this.menuTranslations[
      'OMIRLCONFIG_RADARNOWCASTING_60'
    ] = $localize`:@@OMIRLCONFIG_RADARNOWCASTING_60:Prob2thr 60 Min`;
    this.menuTranslations[
      'OMIRLCONFIG_RADARNOWCASTING_70'
    ] = $localize`:@@OMIRLCONFIG_RADARNOWCASTING_70:Prob2thr 70 Min`;
    this.menuTranslations[
      'OMIRLCONFIG_RADARNOWCASTING_80'
    ] = $localize`:@@OMIRLCONFIG_RADARNOWCASTING_80:Prob2thr 80 Min`;
    this.menuTranslations[
      'OMIRLCONFIG_RADARNOWCASTING_90'
    ] = $localize`:@@OMIRLCONFIG_RADARNOWCASTING_90:Prob2thr 90 Min`;
    this.menuTranslations[
      'OMIRLCONFIG_RADARNOWCASTING_100'
    ] = $localize`:@@OMIRLCONFIG_RADARNOWCASTING_100:Prob2thr 100 Min`;
    this.menuTranslations[
      'OMIRLCONFIG_RADAR'
    ] = $localize`:@@OMIRLCONFIG_RADAR:Radar`;
    this.menuTranslations[
      'OMIRLCONFIG_RADAR_REGLIGURIA'
    ] = $localize`:@@OMIRLCONFIG_RADAR_REGLIGURIA:Regione Liguria`;
    this.menuTranslations[
      'OMIRLCONFIG_RADAR_REGPIEMONTE'
    ] = $localize`:@@OMIRLCONFIG_RADAR_REGPIEMONTE:Regione Piemonte`;
    this.menuTranslations[
      'OMIRLCONFIG_RADAR_LASTIMG'
    ] = $localize`:@@OMIRLCONFIG_RADAR_LASTIMG:Ultima immagine`;
    this.menuTranslations[
      'OMIRLCONFIG_RADAR_ANIMATION'
    ] = $localize`:@@OMIRLCONFIG_RADAR_ANIMATION:Animazione`;
    this.menuTranslations[
      'OMIRLCONFIG_RADAR_INTRAIN5M'
    ] = $localize`:@@OMIRLCONFIG_RADAR_INTRAIN5M:Intensita' oraria pioggia`;
    this.menuTranslations[
      'OMIRLCONFIG_RADAR_RAIN10'
    ] = $localize`:@@OMIRLCONFIG_RADAR_RAIN10:Pioggia cumulata 10'`;
    this.menuTranslations[
      'OMIRLCONFIG_RADAR_RAIN1H'
    ] = $localize`:@@OMIRLCONFIG_RADAR_RAIN1H:Cumulata oraria pioggia`;
    this.menuTranslations[
      'OMIRLCONFIG_RADAR_RAIN1HPLUVIO'
    ] = $localize`:@@OMIRLCONFIG_RADAR_RAIN1HPLUVIO:Pioggia 1h Radar + Pluviometri`;
    this.menuTranslations[
      'OMIRLCONFIG_RADAR_RIFLET'
    ] = $localize`:@@OMIRLCONFIG_RADAR_RIFLET:Riflettivita'`;

    //#endregion radar

    //#region satellite

    this.menuTranslations[
      'OMIRLCONFIG_SATELLITEIR'
    ] = $localize`:@@OMIRLCONFIG_SATELLITEIR:Infrarosso IR`;
    this.menuTranslations[
      'OMIRLCONFIG_SATELLITEVIS'
    ] = $localize`:@@OMIRLCONFIG_SATELLITEVIS:Visibile VIS`;

    //#endregion satellite
  }
}
