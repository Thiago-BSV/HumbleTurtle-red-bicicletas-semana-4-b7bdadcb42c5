var Bicicleta = require("../../models/bicicleta");

exports.bicicleta_list = async function(req, res) {
    res.status(200).json({
        bicicletas: await Bicicleta.allBicis()
    });
}

exports.bicicleta_create = async function(req,res) {
    var body = req.body;
    
    var ubicacion = [body.lat,body.lng];
    var bici = await Bicicleta.createInstance( body.code, body.color.trim(), body.modelo.trim(), ubicacion );

    await Bicicleta.add(bici);

    res.status(200).json({
        bicicleta: bici
    });
}

exports.bicicleta_update = async function(req, res) {

    var bici;    
    // Si no encontramos la bicicleta
    try {
        
        bici = await Bicicleta.findByCode(req.params.code);

        if( bici == null )
            throw new Error("Bicicleta no encontrada.")

    } catch(err) {
        console.error(err);

        res.status(404).json({
            message: "Not found",
            code: 404
        });

        return;
    }
    bici.code = req.body.code;
    bici.color = req.body.color.trim();
    bici.modelo = req.body.modelo.trim();
    bici.ubicacion = [req.body.lat, req.body.lng];
    
    await bici.save();

    res.status(200).json({
        bicicleta: bici
    });

}

exports.bicicleta_delete = async function(req,res) {
    var params = req.params;
    var code = params.code;

    try {
        await Bicicleta.removeByCode(code);
    } catch(err) {
        console.log(err);
    }
    
    // Delete es idempotente, siempre retorna 200 aunque ya se haya borrado el archivo
    res.status(200).json({Response:"Ok"});
}