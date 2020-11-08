var mymap = L.map('mapid').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.',
}).addTo(mymap);


// Agregamos las bicicletas
$.ajax({
    dataType: "json",
    url: "/api/bicicletas",
    success: function(result) {

        console.log(result);

        for( var bici of result.bicicletas ) {
            L.marker( bici.ubicacion, {title: bici.id} ).addTo(mymap);
        }
    }
});
