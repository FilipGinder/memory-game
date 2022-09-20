const express = require('express');
const controller = require('../controllers/mr.controllers')  //moje

const router = express.Router();


// localhost:7000/api/glavna
//u app.js namesteno da sve rote budu samo posle  localhost:8000 ....   umesto da gadja celu putanju   localhost:7000/back/sk

//router.get('/pregled_slika',controller.pregled_slika);
router.post('/pregled_slika1',controller.pregled_slika1);
router.post('/igraci',controller.igraci);
router.post('/pobeda_novi_rezultat',controller.pobeda_novi_rezultat);
router.post('/rezultati',controller.rezultati);
router.post('/ime_igraca',controller.ime_igraca);
router.post('/pobeda_novi_rezultat_duel',controller.pobeda_novi_rezultat_duel);

router.post('/dodavanje_meca',controller.dodavanje_meca);
router.post('/dodavanje_mec_kartica',controller.dodavanje_mec_kartica);
router.post('/sve_kartice',controller.sve_kartice);


module.exports = router;