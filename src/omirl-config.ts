export class Config {
	public static apiProtocol: string = "https"
	public static siteURL: string = Config.apiProtocol + "://omirl.regione.liguria.it" 
	public static apiURL: string = Config.apiProtocol + "://omirl.regione.liguria.it/Omirl/rest"
	public static sensorsApiURL: string = Config.apiURL + "/mapnavigator/sensors"
	public static mapsApiURL: string = Config.apiURL + "/mapnavigator/maps"
	public static staticsApiURL: string = Config.apiURL + "/mapnavigator/statics"
}