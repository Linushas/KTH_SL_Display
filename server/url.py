url = "https://transport.integration.sl.se/v1/sites/"

# ------ SITES ------
site1 = "7000" # Huddinge Sjukhus (Visar data för busshållplatserna: Huddinge Sjukhus -A, -B, -C, -D, -E, -F, -G)
#site2 = "7001" # Flemingsbergs centrum
#site3 = "7002" # Diagnosvägen
#site4 = "7003" # Ortopedvägen
#site5 = "7004" # Södertörns högskola
#site6 = "7005" # Hälsovägen
#site7 = "7006" # Flemingsbergs station
#site8 = "7007" # Flemingsbergs stn (Fjärrtåg)
#site9 = "7008" # Blickagången
site_trains = "9524" # Pendeltåg
site_tcentral = "9001"
site_trams = "9126"
site_ship = "4031"

# ------ FULL URL ---------
busURL = url + site1 + "/departures"
trainURL = url + site_trains + "/departures"
metroURL = url + site_tcentral + "/departures"
tramURL = url + site_trams + "/departures"
shipURL = url + site_ship + "/departures"