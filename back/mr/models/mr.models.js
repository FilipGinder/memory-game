const sql = require("../../db/konekcija").pool;
const express = require('express');
const router = express.Router();

const Mr = {};

Mr.pregled_slika1 = data => {

    let sqlQuery = `SELECT id,url,naziv FROM slike ORDER BY RAND() LIMIT ${data.body.br_slicica}`

      
    return new Promise((resolve, reject) => {
        sql.query(sqlQuery,
            (error, rows, fields) => {
                if (error) {
                    reject(error);
                    return 1;
                } else {
                    resolve(rows);
                }
            });
       });
};


Mr.igraci = data => { 

    let sqlQuery = `SELECT * FROM igraci`

      
    return new Promise((resolve, reject) => {
        sql.query(sqlQuery,
            (error, rows, fields) => {
                if (error) {
                    reject(error);
                    return 1;
                } else {
                    resolve(rows);
                }
            });
       });
};




Mr.pobeda_novi_rezultat = data => {
    
    const igrac = data.body.igrac;
    const br_poteza = data.body.br_poteza;
    const br_slicica = data.body.br_slicica;
    const vreme = data.body.vreme;

    let sqlQuery = `SELECT potezi FROM rezultati  WHERE id_igraca = "${igrac}" AND br_slicica = "${br_slicica}"`;
    return new Promise((resolve, reject) => {
         sql.query(sqlQuery,
             (error, rows, fields) => {
                 if (error) {
                     reject(error);
                     return 1;
                 } else {
                    //var potezi = JSON.stringify(rows[0].potezi);   
                    //resolve(rows);

                    // if(typeof rows === 'undefined' || typeof rows !== null){
                    //             const sqlString = `INSERT INTO rezultati (id_igraca,vreme,potezi,br_slicica) VALUES (${igrac},'','${br_poteza}','${br_slicica}')`;     
                    //             sql.query(sqlString,
                    //                 (error, rowss, fields) => {
                    //                     if (error) {
                    //                         reject1(error);
                    //                         return 1;
                    //                     } else {
                    //                         resolve({poruka: "novi igrac - novi rekord"});
                    //                     }
                    //                 });
                    // }else{
                            var potezi = rows[0].potezi;
                            if(potezi > br_poteza){
                                            
                                            const sqlString = `DELETE FROM rezultati WHERE id_igraca = ${igrac} AND br_slicica = "${br_slicica}"`;     
                                            sql.query(sqlString,
                                                (error, rowss, fields) => {
                                                    if (error) {
                                                        reject1(error);
                                                        return 1;
                                                    } else {
                                                        const sqlString = `INSERT INTO rezultati (id_igraca,vreme,potezi,br_slicica) VALUES (${igrac},'${vreme}','${br_poteza}','${br_slicica}')`;     
                                                        sql.query(sqlString,
                                                            (error, rowss, fields) => {
                                                                if (error) {
                                                                    reject1(error);
                                                                    return 1;
                                                                } else {
                                                                    resolve({poruka: "novi rekord"});
                                                                }
                                                            });  
                                                    }
                                                }); 
                                            
                            }else{
                                resolve({poruka: "manje od vec postignutih rezultata"});
                            }
                 //   }
                }
            });
       });
};



Mr.rezultati = data => { 

    let sqlQuery = `SELECT i.username,r.vreme,r.potezi,r.br_slicica FROM rezultati r LEFT JOIN igraci i ON i.id = r.id_igraca ORDER BY vreme, potezi`

      
    return new Promise((resolve, reject) => {
        sql.query(sqlQuery,
            (error, rows, fields) => {
                if (error) {
                    reject(error);
                    return 1;
                } else {
                    resolve(rows);
                }
            });
       });
};

Mr.ime_igraca = data => { 
    
    const igrac = data.body.igrac;

    let sqlQuery = `SELECT username FROM igraci WHERE id = "${igrac}"`

      
    return new Promise((resolve, reject) => {
        sql.query(sqlQuery,
            (error, rows, fields) => {
                if (error) {
                    reject(error);
                    return 1;
                } else {
                    resolve(rows);
                }
            });
       });
};



Mr.pobeda_novi_rezultat_duel = data => { 
    
    const igrac = data.body.igrac;
    const igrac_poeni = data.body.igrac_poeni;
    const igrac_dva = data.body.igrac_dva;
    const igrac_dva_poeni = data.body.igrac_dva_poeni;
    const ukp_br_poteza = data.body.ukp_br_poteza;
    const vreme = data.body.vreme;
    const winner = data.body.winner;
    const br_slicica = data.body.br_slicica;

    const sqlString = `INSERT INTO mec 
    (igrac_jedan_id,igrac_jedan_br_poena,igrac_dva_id,igrac_dva_br_poena,ukupan_br_poteza,duzina_partije,winner,br_slicica) 
     VALUES 
     ('${igrac}','${igrac_poeni}','${igrac_dva}','${igrac_dva_poeni}','${ukp_br_poteza}','${vreme}','${winner}','${br_slicica}')`;   
    return new Promise((resolve, reject) => {
   
                sql.query(sqlString,
                    (error, rowss, fields) => {
                        if (error) {
                            reject(error);
                            return 1;
                        } else {
                            resolve({poruka: "uspesno"});
                        }
                    });  
       });
};






Mr.dodavanje_meca = data => { 
    
    const igrac = data.body.igrac;
    const igrac_dva = data.body.igrac2;
    const br_slicica = data.body.br_slicica;

    const sqlString = `INSERT INTO mec 
    (igrac_jedan_id,igrac_dva_id,br_slicica,online) 
    VALUES 
    ('${igrac}','${igrac_dva}','${br_slicica}',1)`;   
    return new Promise((resolve, reject) => {
   
                sql.query(sqlString,
                    (error, rowss, fields) => {
                        if (error) {
                            reject(error);
                            return 1;
                        } else {
                            resolve({id: rowss.insertId});
                            //resolve({poruka: "uspesno"});
                        }
                    });  
       });
};



Mr.dodavanje_mec_kartica = data => { 
    
    const id_meca = data.body.id_meca;
    const id_kartice = data.body.id_kartice;

    const sqlString = `INSERT INTO mec_kartice 
    (id_meca, id_kartice, status) 
    VALUES 
    ('${id_meca}','${id_kartice}',0)`;   
    return new Promise((resolve, reject) => {
   
                sql.query(sqlString,
                    (error, rowss, fields) => {
                        if (error) {
                            reject(error);
                            return 1;
                        } else {
                            //resolve({id: rowss.insertId});
                            resolve({poruka: "uspesno"});
                        }
                    });  
       });
};



Mr.sve_kartice = data => { 
    
    const id_meca = data.body.id_meca;

    let sqlQuery = `SELECT mk.id AS card_id, mk.id_meca, mk.id_kartice, mk.status, s.id AS slk_id, s.url, s.naziv FROM mec_kartice mk LEFT JOIN slike s ON s.id = mk.id_kartice  WHERE id_meca = "${id_meca}"`

      
    return new Promise((resolve, reject) => {
        sql.query(sqlQuery,
            (error, rows, fields) => {
                if (error) {
                    reject(error);
                    return 1;
                } else {
                    resolve(rows);
                }
            });
       });
};

module.exports = Mr;