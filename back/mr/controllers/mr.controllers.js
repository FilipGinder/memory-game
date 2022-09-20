const Mr = require('../models/mr.models');


module.exports.pregled_slika1 = function (req,res) {

    console.log("create")
        return new Promise((resolve,reject) => {
            Mr.pregled_slika1(req).then((data)=>{
                res.status(200).send(data);
            }).catch((err) => {
                res.status(500).send({
                    message:
                        err.message || 'Greška kontaktirajte administratora.'
                });
            })
        })

}


module.exports.igraci = function (req,res) {

    console.log("create")
        return new Promise((resolve,reject) => {
            Mr.igraci(req).then((data)=>{
                res.status(200).send(data);
            }).catch((err) => {
                res.status(500).send({
                    message:
                        err.message || 'Greška kontaktirajte administratora.'
                });
            })
        })

}



module.exports.pobeda_novi_rezultat = function (req,res) {

    console.log("create")
        return new Promise((resolve,reject) => {
            Mr.pobeda_novi_rezultat(req).then((data)=>{
                res.status(200).send(data);
            }).catch((err) => {
                res.status(500).send({
                    message:
                        err.message || 'Greška kontaktirajte administratora.'
                });
            })
        })

}


module.exports.rezultati = function (req,res) {

    console.log("create")
        return new Promise((resolve,reject) => {
            Mr.rezultati(req).then((data)=>{
                res.status(200).send(data);
            }).catch((err) => {
                res.status(500).send({
                    message:
                        err.message || 'Greška kontaktirajte administratora.'
                });
            })
        })

}

module.exports.ime_igraca = function (req,res) {

    console.log("create")
        return new Promise((resolve,reject) => {
            Mr.ime_igraca(req).then((data)=>{
                res.status(200).send(data);
            }).catch((err) => {
                res.status(500).send({
                    message:
                        err.message || 'Greška kontaktirajte administratora.'
                });
            })
        })

}

module.exports.pobeda_novi_rezultat_duel = function (req,res) {

    console.log("create")
        return new Promise((resolve,reject) => {
            Mr.pobeda_novi_rezultat_duel(req).then((data)=>{
                res.status(200).send(data);
            }).catch((err) => {
                res.status(500).send({
                    message:
                        err.message || 'Greška kontaktirajte administratora.'
                });
            })
        })

}


module.exports.dodavanje_meca = function (req,res) {

    console.log("create")
        return new Promise((resolve,reject) => {
            Mr.dodavanje_meca(req).then((data)=>{
                res.status(200).send(data);
            }).catch((err) => {
                res.status(500).send({
                    message:
                        err.message || 'Greška kontaktirajte administratora.'
                });
            })
        })

}

module.exports.dodavanje_mec_kartica = function (req,res) {

    console.log("create")
        return new Promise((resolve,reject) => {
            Mr.dodavanje_mec_kartica(req).then((data)=>{
                res.status(200).send(data);
            }).catch((err) => {
                res.status(500).send({
                    message:
                        err.message || 'Greška kontaktirajte administratora.'
                });
            })
        })

}


module.exports.sve_kartice = function (req,res) {

    console.log("create")
        return new Promise((resolve,reject) => {
            Mr.sve_kartice(req).then((data)=>{
                res.status(200).send(data);
            }).catch((err) => {
                res.status(500).send({
                    message:
                        err.message || 'Greška kontaktirajte administratora.'
                });
            })
        })

}

