var Bicicleta = require("../../models/bicicleta.js");

exports.bicicleta_list = async function(req, res) {
    res.render('bicicletas/index', {bicis: await Bicicleta.allBicis() } );
}

exports.bicicleta_create = function(req, res) {
    res.render('bicicletas/create');
}

exports.bicicleta_create_post = async function(req, res) {
    var bici = await Bicicleta.createInstance(req.body.code, req.body.color.trim(), req.body.modelo.trim());
    bici.ubicacion = [req.body.lat, req.body.lng];

    await Bicicleta.add(bici);

    res.redirect('/bicicletas');
}

exports.bicicleta_update = async function(req, res) {
    var bici = await Bicicleta.findByCode(req.params.code);
    
    console.log(bici);

    res.render('bicicletas/update', {bici} );
}

exports.bicicleta_update_post = async function(req, res) {
    var bici = await Bicicleta.findByCode(req.params.code);

    bici.code = req.body.code;
    bici.color = req.body.color.trim();
    bici.modelo = req.body.modelo.trim();
    bici.ubicacion = [req.body.lat, req.body.lng];

    await bici.save();

    res.redirect(`/bicicletas`)
}

exports.bicicleta_delete_post = async function(req, res) {
    var code = parseInt( req.body.code );
    await Bicicleta.removeByCode(code);

    res.redirect('/bicicletas');
}