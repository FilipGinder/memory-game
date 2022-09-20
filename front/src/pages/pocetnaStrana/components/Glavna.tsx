import 'bootstrap/dist/css/bootstrap.min.css'
import { Container,  Row, Col, Button} from 'react-bootstrap';
import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import '../css/index.scss';
import winer from '../../../slike/winer.gif';
import { useLocation, Link } from 'react-router-dom';
import Modal_nova_partija from './modal_nova_partija';
import { PocModalContext } from "../../../globalne/PocModalContext";
import * as io from 'socket.io-client';
//import useDynamicRefs from 'use-dynamic-refs';  //npm i use-dynamic-refs --force


//aktivni_igrac promenljiva:  kada je true aktivan je prvi igrac kada je false aktivan je drugi igrac

import styles from '../css/moj.module.scss';

type Tipovi_podataka = {
    igrac: number;
    igrac2: number;
    br_poteza: number;
    br_slicica: number;
    id_meca: any;
    kanal:any;
}


function Glavna(props:any) {
    const socket = io.connect("http://localhost:3001");
    //let url_socket = "http://localhost:3001";
    //const socket = io.connect(url_socket, { autoConnect: false });

    const {podaci, setPodaci} = useContext(PocModalContext);

    let prviPotez = 0;
    let isPaused = false;
    let prviKlik:any;
    let matches:any = 0;
    var timer :any;
    let aktivni_igrac = true;
    let winner:any;
    let da_li_je_bio_poen = false;
    //let online_id_meca = podaci[0].id_meca;
    
    
    
    const dolaz_param = useLocation();
    const podaci_dolazni = dolaz_param.state as Tipovi_podataka;
    const [kanal, setKanal] = useState(podaci_dolazni.kanal);
    const [igrac, setIgrac] = useState<number>(podaci_dolazni.igrac);
    const [ime_igraca, setIme_igraca] = useState<any>();
    const [igrac_br_poena, setIgrac_br_poena] = useState<any>(0);
    //let igrac_br_poena = 0;
    const [aktivni_igrac_style, setAktivni_igrac_style] = useState<any>(styles.aktivan_igrac);
    const prvi_igrac_poeniRef = useRef<any>();
    const prvi_igrac_imeRef = useRef<any>(); 
    //alert(podaci_dolazni.igrac2+' '+podaci[0].id_igraca2) ;
    const [igrac2, setIgrac2] = useState<number>(podaci_dolazni.igrac2);
    const [ime_igraca2, setIme_igraca2] = useState<any>();
    const [igrac_br_poena2, setIgrac_br_poena2] = useState<any>(0);
    //let igrac_br_poena2 = 0;
    const [aktivni_igrac_style2, setAktivni_igrac_style2] = useState<any>(styles.neaktivan_igrac);
    const drugi_igrac_poeniRef = useRef<any>();
    const drugi_igrac_imeRef = useRef<any>(); 
    const [akt_ne_akt_igrac, setAkt_ne_akt_igrac] = useState(styles.aktivna_igra);
    const [igrac_jedan_socket_id, setIgrac_jedan_socket_id] = useState<any>();
    
    //const [aktivni_igrac, setAktivni_igrac] = useState<any>(true);  //PO DEFAULTU TRUE ZNACI DA JE PRVI IGRAC AKTIVAN...KADA JE FALSE ONDA JE AKTIVAN DRUGI IGRAC
    
    
    const trenutni_potez = useRef<any>();
    const [ukp_br_poteza, setUkp_br_poteza] = useState<number>(10 /*podaci_dolazni.br_poteza*/);
    const [ukp_br_slicica, setUkp_br_slicica] = useState<number>(podaci_dolazni.br_slicica);
    const [game, setGame] = useState<any>();
    
    const [pobeda_modal, setPobeda_modal] = useState(false);
    const [winer_provera, setWiner_provera] = useState(false);
    
    const okvirRef = useRef<any>();
    const resetRef = useRef<any>();
    const minuti = useRef<any>();
    const sekunde = useRef<any>();
    const [sve_karte, setSve_karte] = useState<any>();
    const [sve_slidze, setSve_slidze] = useState<any>();
    const [potez_br, setPotez_br] = useState<number>(0);

    const [id_meca, setId_meca] = useState<number>(podaci_dolazni.id_meca);

    //const [ukupno, setUkupno] = useState<any>();
    //const [preostalo, setPreostalo] = useState<any>();

 
    const [start_timer, setStart_timer] = useState<any>(false);
    const [mins, setMins] = useState<any>(0);
    const [secs, setSecs] = useState<any>(0);

    /*const [getRef, setRef] =  useDynamicRefs();*/

    /*OVAKO NESTO*/
//alert(podaci[0].id_igraca2)
/*
    if(typeof podaci[0].id_igraca2 != 'undefined'){
        setIgrac2(podaci[0].id_igraca2);
    }
    alert(igrac+ ' ' +igrac2);
    */
/*OVAKO NESTO*/
    const Ime_igraca = async () => {

        const response = await axios.post("http://localhost:8000/ime_igraca", { igrac: igrac });
        setIme_igraca(response.data[0].username);
    }

    const Ime_igraca1 = async () => {
        if(typeof igrac2 != 'undefined'){ //ovim uslovom kazemo da ovo unutar ovog if-a radi samo kad su dva igraca aktivna ... bilo lokalno bilo online
            const response = await axios.post("http://localhost:8000/ime_igraca", { igrac: igrac2 });
            setIme_igraca2(response.data[0].username);
        }
    }


    const Sve_slike = async () => {
        // const response = await axios.get("http://localhost:8000/pregled_slika");
        // resetIgrice(response.data);
        // setSve_slidze(response.data);

        const response = await axios.post("http://localhost:8000/pregled_slika1", { br_slicica: ukp_br_slicica });
        resetIgrice(response.data);
        setSve_slidze(response.data);

    }
 
    useEffect(() => { 
    Sve_slike();
    Ime_igraca();
    Ime_igraca1();
    },[]);
    let provera:any = null;

    const prokazSlika = async (slika : any) => {
     /*AKO JE VARIJANTA ONLINE ONDA SAMO ISCITAVAMO SLIKE IZ BAZE I PRIKAZUJEMO IH NA OBA UREDJAJA A DODAVANJE KARTICA MECA SE RADI IZ MODALA...KORAK RANIJE
     A AKO LOKALNI GAME ONDA OVDE PRVO UBACI SVE SLIKE U BAZU PA IH ODMAH ZATIM IZCITA*/

    if(podaci[0].da_li_je_online === "online je"){
        /*ovako iscitava sve slike iz baze kada se igra online*/
        await fetch('http://localhost:8000/sve_kartice', {
                        method: 'POST', 
                        headers: {
                        'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id_meca:id_meca,
                        })
                    
                    }).then(res => res.json()).then(data => {
                        if(data !== ""){

                                    const slikeHTML = data.map( (item :any, index: any) => {  
                                                return (
                                                            <div className="card" /*ref={setRef(item.card_id) as React.RefObject<HTMLDivElement>} */  id={index}  onClick={  (event) => { klikKartica(event); } }  data-slikanaziv={item.slk_id} >

                                                                <div className="front"></div>

                                                                <div className="back rotated">
                                                                    {/* <h2>{slika.naziv}</h2>  */}
                                                                    <img src={require(`../../../../slike/${item.url}`)} alt={item.naziv} width="160px" height="160px"/>
                                                                </div>
                                                                
                                                            </div>
                                                )                                         
                                            });
                                setSve_karte(slikeHTML); 
                        }
                    })
        /*ovako iscitava sve slike iz baze kada se igra online*/
    }else{
        /*ovakoje opcija za lokalni game na jednom racunaru */
                    slika.sort((_:any) => Math.random() - 0.5);
                        
                    if(provera === null){ //da nam ne bi unosio dva puta u bazu kartice JEDAN BROWSER ovim smo ga pi......
                    const slikeHTML = slika.map( (slika :any) => {
                        // alert(podaci[0].da_li_je_online);
                                if(typeof igrac2 != 'undefined'){
                                    axios.post("http://localhost:8000/dodavanje_mec_kartica", { id_meca: id_meca, id_kartice: slika.id  });
                                }
                    
                            return (
                                        <div className="card"    onClick={  (event) => { klikKartica(event); } }  data-slikanaziv={slika.id} >

                                            <div className="front"></div>

                                            <div className="back rotated">
                                                {/* <h2>{slika.naziv}</h2>  */}
                                                <img src={require(`../../../../slike/${slika.url}`)} alt={slika.naziv} width="160px" height="160px"/>
                                            </div>
                                            
                                        </div>
                            )
                            //key={slika.id}
                            
                        });
                        
                    setSve_karte(slikeHTML);   
                    provera = 0;  
                }
        /*ovakoje opcija za lokalni game na jednom racunaru */
    }


         
        if(ukp_br_slicica === 8){
            setGame(styles.game8);
        }else if(ukp_br_slicica === 16){
            setGame(styles.game16);
        }else if(ukp_br_slicica === 20){
            setGame(styles.game20);
        }


    } 

    
    
/******************************************************************************************************************/
/******************************************************************************************************************/
/******************************************OPCIJE ZA DVA ONLINE IGRACA*********************************************/
/******************************************************************************************************************/
/******************************************************************************************************************/
    useEffect(() => { 
  
        },[aktivni_igrac]);



    /* sa ove stranice tj iz ove komponente moramo ponovo prvo da udjemo u room - kanal to radimo odmah po ucitavanju stranice*/
    /*?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????*/
    useEffect(() => { 
        if(typeof kanal != 'undefined'){  //bukvalno provera da li je online partija ili nije
            socket.emit("join_room", kanal); //ako jeste udju u sobu - kanal
        }
    });
    /* sa ove stranice tj iz ove komponente moramo ponovo prvo da udjemo u room - kanal to radimo odmah po ucitavanju stranice*/
    


    
  useEffect(() => {     

            socket.on("igrac_jedan_socket_id", (data) => {
            setIgrac_jedan_socket_id(data);           
            });


            socket.on("online_pokretanje_sata", (data) => {  
                if(data.zahtev === "pokreni"){
                    setStart_timer(true);
                    console.log(data.id_card);


                    setSve_karte(data.sve_karte);
               
                       // okvirRef.current.children[data.id_card].click(); //UDE U LOOP IZ NEKOG RAZLOGA
                        
                }             
            });

            socket.on("igrac_jedan_aktivan_obelezi", (data) => {  
                if(data.igrac_jedan_aktivan === "igrac_jedan_aktivan"){
                    aktivni_igrac = true;
                    setAktivni_igrac_style(styles.aktivan_igrac);
                    setAktivni_igrac_style2(styles.neaktivan_igrac);
                }             
            });

            socket.on("igrac_dva_aktivan_obelezi", (data) => {  
                if(data.igrac_dva_aktivan === "igrac_dva_aktivan"){
                    aktivni_igrac = false;
                    setAktivni_igrac_style(styles.neaktivan_igrac);
                    setAktivni_igrac_style2(styles.aktivan_igrac);
                }             
            });

            socket.on("igrac_jedan_dodaj_poen_prikazi", (data) => {                  
                let prvi_igr_poeni = prvi_igrac_poeniRef.current.innerText; 
                //alert('kod prvog upao' + prvi_igr_poeni)
                setIgrac_br_poena( parseInt(prvi_igr_poeni) + 1 );
                da_li_je_bio_poen = true;                      
            });

            socket.on("igrac_dva_dodaj_poen", (data) => {            
                let drugi_igr_poeni = drugi_igrac_poeniRef.current.innerText;     
                //alert('kod drugog upao' + drugi_igr_poeni)                
                setIgrac_br_poena2( parseInt(drugi_igr_poeni) + 1);
                da_li_je_bio_poen = true;                     
            });

            socket.on("vracanje_trenutni_potez", (data) => {   
                if(data.br_pot === "trenutni_broj_poteza"){
                    prviPotez++; 
                    setPotez_br(prviPotez); 
                }                             
            });

   },[socket]);

/******************************************************************************************************************/
/******************************************************************************************************************/
/******************************************OPCIJE ZA DVA ONLINE IGRACA*********************************************/
/******************************************************************************************************************/
/******************************************************************************************************************/
      


    const klikKartica = (event:any) => {   
         
        if(podaci[0].da_li_je_online === "online je"){  
            //socket.emit("prvi_igram", { kanal });
            let zahtev = "pokreni";
            let id_card = event.currentTarget.id;
            socket.emit("zahtev_za_porkretanje_sata", { kanal, zahtev, id_card, sve_karte });  //zahtev za pokretanje vremena na oba uredjaja - dvosmerna komunikacija sa serverom
            
            //socket.emit("provera_ko_je_aktivan", { kanal, aktivni_igrac });  //jednosmerna komunikacija sa serverom 
        }else{   //ako je lokalna partija za dva igraca na jednom kompu onda samo pokrecemo vreme
            setStart_timer(true);
        }

        const slikaKartica = event.currentTarget;
        //console.log(event.currentTarget.id);  
        const [front, back] = getFrontAndBackFromCard(slikaKartica);

        if(front.classList.contains("rotated") || isPaused) return;
        isPaused = true;
        rotateElements([front, back]);

        if(!prviKlik){  //drugi pokusaj tj klik na drugu sliku....ovo okrece drugu sliku
            
            prviKlik = slikaKartica;
            isPaused = false;
            if(prviPotez === ukp_br_poteza){
                alert('kraj igre');
                resetRef.current.click();
            }
        }else{
            
            const drugoizabranoime = slikaKartica.dataset.slikanaziv;
            const prvoizabranoime = prviKlik.dataset.slikanaziv;
            if(prvoizabranoime !== drugoizabranoime) {
                 const [prviFront, prviBack] = getFrontAndBackFromCard(prviKlik);
                 setTimeout(() =>{  //posle dva promasaja  ovo vraca slike u prvobitan polozaj
                    rotateElements([front, back, prviFront, prviBack]);
                    prviKlik = null;
                    isPaused = false;
                 }, 500)    
                 //OVDE PROMENITI AKTIVNOG IGRACA

            }else{  

                //I OVDE PROMENITI AKTIVNOG IGRACA
                matches++;
                                                                   
                        /*provera kome dodeljujemo poen...kada je ostvaren poen proveravamo true/false da vidimo kome dodeljujemo poen*/
                        if(typeof igrac2 != 'undefined'){  //ovim uslovom kazemo da ovo unutar ovog if-a radi samo kad su dva igraca aktivna
                                if(aktivni_igrac === true){  
                                        if(podaci[0].da_li_je_online === "online je"){                                               
                                            socket.emit("igrac_jedan_dodaj_poen", { kanal });  //zahtev za pokretanje vremena na oba uredjaja
                                        }else{ 
                                            let prvi_igr_poeni = prvi_igrac_poeniRef.current.innerText; 
                                            setIgrac_br_poena( parseInt(prvi_igr_poeni) + 1 );
                                            da_li_je_bio_poen = true;
                                        }
                                }else if(aktivni_igrac === false){      
                                        if(podaci[0].da_li_je_online === "online je"){                                               
                                            socket.emit("igrac_dva_dodaj_poen", { kanal });  //zahtev za pokretanje vremena na oba uredjaja
                                        }else{ 
                                            let drugi_igr_poeni = drugi_igrac_poeniRef.current.innerText;                     
                                            setIgrac_br_poena2( parseInt(drugi_igr_poeni) + 1);
                                            da_li_je_bio_poen = true;
                                        }
                                }
                         }else{  //prvom igracu uvek povecavaj poene kada sam igra
                                    let prvi_igr_poeni = prvi_igrac_poeniRef.current.innerText; 
                                    setIgrac_br_poena( parseInt(prvi_igr_poeni) + 1 );
                         }
                        /*provera kome dodeljujemo poen...kada je ostvaren poen proveravamo true/false da vidimo kome dodeljujemo poen*/

                        if(matches === ukp_br_slicica){ //pobeda ako je broj poena jadnak broju slicica
                            //console.log("winner");
                            //alert('Bravo pobedio si');
                            let vreme = `${minuti.current.innerText}:${sekunde.current.innerText}`; 
                            

                            setStart_timer(false); //zaustavljamo vreme kad uspesno zavrsi partiju
                            setTimeout(() =>{                       
                                //resetRef.current.click(); //ovo se ipak radi iz modala
                            if(typeof igrac2 != 'undefined'){ //ovim uslovom kazemo da ovo unutar ovog if-a radi samo kad su dva igraca aktivna

                                if(parseInt(prvi_igrac_poeniRef.current.innerText) > parseInt(drugi_igrac_poeniRef.current.innerText)){
                                    alert('Bravo '+ prvi_igrac_imeRef.current.innerText + ' pobeda');
                                    winner = 1;
                                }else if(parseInt(prvi_igrac_poeniRef.current.innerText) < parseInt(drugi_igrac_poeniRef.current.innerText)){
                                    alert('Bravo '+ drugi_igrac_imeRef.current.innerText + ' pobeda');
                                    winner = 2;
                                }else if(parseInt(prvi_igrac_poeniRef.current.innerText) === parseInt(drugi_igrac_poeniRef.current.innerText)){
                                    alert('nereseno');
                                    winner = 0;
                                }

                                    /*Upisivanje podataka u bazu kada igra dva igraca igraca*/
                                    let vreme = `${minuti.current.innerText}:${sekunde.current.innerText}`;               
                                    const response = axios.post("http://localhost:8000/pobeda_novi_rezultat_duel", { 
                                        igrac: igrac, //prvi_igrac_imeRef.current.innerText, 
                                        igrac_poeni: prvi_igrac_poeniRef.current.innerText,
                                        igrac_dva: igrac2,//drugi_igrac_imeRef.current.innerText,
                                        igrac_dva_poeni: drugi_igrac_poeniRef.current.innerText,
                                        ukp_br_poteza: trenutni_potez.current.innerText,
                                        vreme:vreme,
                                        winner:winner,
                                        br_slicica: ukp_br_slicica
                                        });
                                    /*Upisivanje podataka u bazu kada igra dva igraca igraca*/

                                    
                            }else{ //ovo radi ako je samo jedan igrac aktivan
                                    /*Upisivanje podataka u bazu kada igra jedan igrac solo*/                                               
                                    const response = axios.post("http://localhost:8000/pobeda_novi_rezultat", { igrac:igrac, br_poteza:prviPotez, br_slicica: ukp_br_slicica, vreme: vreme });
                                    /*Upisivanje podataka u bazu kada igra jedan igrac solo*/
                            }
                                setPobeda_modal(true);
                                setWiner_provera(true);                                                                               
                            }, 600); 

                            
                        }
                        prviKlik = null;
                        isPaused = false;
            }
             
            if(podaci[0].da_li_je_online === "online je"){ 
                let br_pot = "trenutni_broj_poteza";
                socket.emit("trenutni_potez", { kanal, br_pot });
            }else{
                prviPotez++; 
                setPotez_br(prviPotez);
            }
            
            if(prviPotez === ukp_br_poteza){
                alert('kraj igre');
                resetRef.current.click();
            }

                        /*prebacivanje aktivnog igraca- promena style  provera da li je poen ako je bio poen onda ostavljamo tog igrca jos uvek aktivnim da moze da igra sledeci korak
                        a ako nije poen onda prebacujemo na sledeceg igraca
                        1. PRVO IDE PROVERA DA LI JE IGRA ZA DVA ILI JEDNOG IGRACA--AKO JE ZA DVA ONDA ILAZI U IF
                        2.ZATIM PROVERA KOJI IGRAC JE AKTIVAN TRUE JE IGRAC BR 1 FALSE JE IGRAC BR 2
                        3.ZATIM IDE PROVERA DA LI JE BIO POEN???? 
                        4.AKO JESTE OSTAVLJA IGRACA I DALJE AKTIVNIM I STYLE NE MENJA
                        5.AKO NIJE BIO POEN POSLE DRUGOG KLIKA ONDA PREBACUJE NA DRUGOG IGRACA aktivni_igrac = false I MENJA STYLE                     
                        6.OD DRUGE TACKE DO PETE ISTI PRINCIP ALI SUPROTNO RADI ZA DRUGOG IGRACA
                        7.PROVERU DA LI JE BIO POEN VRACA NA FALSE....NJU SETUJEMO SVAKI PUT KADA SE DESI POEN NA TRUE
                        */



                        // if(podaci[0].da_li_je_online == "online je"){ 
                        //     let zahtev = "pokreni";     
                        //     socket.emit("zahtev_za_porkretanje_sata", { kanal, zahtev });  //zahtev za pokretanje vremena na oba uredjaja
                        // }else{   //ako je lokalna partija za dva igraca na jednom kompu onda samo pokrecemo vreme
                            
                        // }


                        if(typeof igrac2 != 'undefined'){ //ovim uslovom kazemo da ovo unutar ovog if-a radi samo kad su dva igraca aktivna
                            if(aktivni_igrac === true){ //ako je prvi aktivan u drugom kliku....prebaci na drugog              
                                if(da_li_je_bio_poen === true) {  //ako je prvi igrac napravio poen 

                                        if(podaci[0].da_li_je_online === "online je"){  
                                            let igrac_jedan_aktivan = 'igrac_jedan_aktivan';
                                            socket.emit("igrac_jedan_aktivan", { kanal, igrac_jedan_aktivan });
                                        }else{ //ako je lokalna partija
                                            aktivni_igrac = true;       //i dalje ostani aktivan
                                            setAktivni_igrac_style(styles.aktivan_igrac);
                                            setAktivni_igrac_style2(styles.neaktivan_igrac);
                                        }
                                    
                                }else{                         //ako nije bio poen onda prebaci na drugog
                                        if(podaci[0].da_li_je_online === "online je"){
                                            let igrac_dva_aktivan = 'igrac_dva_aktivan';
                                            socket.emit("igrac_dva_aktivan", { kanal, igrac_dva_aktivan });
                                        }else{ //ako je lokalna partija
                                                aktivni_igrac = false;
                                                setAktivni_igrac_style(styles.neaktivan_igrac);
                                                setAktivni_igrac_style2(styles.aktivan_igrac);
                                        }
                                }                             
                                da_li_je_bio_poen = false;
                                
                            }else if(aktivni_igrac === false){ //ako je drugi aktivan u drugom kliku...vrati na prvog 
                                if(da_li_je_bio_poen === true) {  //ako je drugi igrac napravio poen 
                                        if(podaci[0].da_li_je_online === "online je"){
                                            let igrac_dva_aktivan = 'igrac_dva_aktivan';
                                            socket.emit("igrac_dva_aktivan", { kanal, igrac_dva_aktivan });
                                        }else{ //ako je lokalna partija
                                                aktivni_igrac = false;      //i dalje ostani aktivan
                                                setAktivni_igrac_style(styles.neaktivan_igrac);
                                                setAktivni_igrac_style2(styles.aktivan_igrac);
                                        }
                                }else{                           //ako nije vrati-prebaci na prvog
                                        if(podaci[0].da_li_je_online === "online je"){
                                            let igrac_jedan_aktivan = 'igrac_jedan_aktivan';
                                            socket.emit("igrac_jedan_aktivan", { kanal, igrac_jedan_aktivan });
                                        }else{ //ako je lokalna partija
                                            aktivni_igrac = true;
                                            setAktivni_igrac_style(styles.aktivan_igrac);
                                            setAktivni_igrac_style2(styles.neaktivan_igrac);
                                        }
                                }
                                da_li_je_bio_poen = false;
                                
                            }
                        }
                        /*prebacivanje aktivnog igraca- promena style*/

        }    
      //  console.log(preostalo);  
    }








    const rotateElements = (elements : any) => {
        if(typeof elements !== 'object' || !elements.length) return;

        elements.forEach((element :any) => element.classList.toggle('rotated'));
    }

    const getFrontAndBackFromCard = (card : any) => {
        const front = card.querySelector(".front");
        const back = card.querySelector(".back");
        return [front, back]
    }



    const resetIgrice =  (slika : any) => { 
        //posle reseta ne pokazuje ponovo modal??????????????????????????????????????????????????????????????????????????????????????????????
        setSve_karte('');
        setPotez_br(0);
        isPaused = true;
        prviKlik = null;
        matches = 0;
        prviPotez = 0;
        setWiner_provera(false);
        setStart_timer(false); //zaustavljane tajmera
        setMins(0); //restart tajmera - minuti
        setSecs(0); //restart tajmera - sekunde
        setAktivni_igrac_style(styles.aktivan_igrac);
        setIgrac_br_poena(0);
        //igrac_br_poena = 0;
        setAktivni_igrac_style2(styles.neaktivan_igrac);
        //igrac_br_poena2 = 0;
        setIgrac_br_poena2(0);
        aktivni_igrac = true;

        setTimeout(async() => {
            prokazSlika([...slika, ...slika]);
            isPaused = false;
        },200)
        
    }

    //resetIgrice();



//**************************************TAJMER**************************************     
    useEffect(() => { 
        
        if(start_timer === true){
            timer = setInterval(() =>{
                setSecs(secs + 1);
            
                if(secs === 59){
                    setMins(mins + 1);
                    setSecs(0);
                }
            },1000)
            return () => clearInterval(timer);
        }
            
         
    });
//**************************************TAJMER**************************************  

    return (

    <Container fluid id="klijenat_izm">
        {winer_provera?<img className="d-block w-100" id="winer" src={winer} alt="winer"/> :null}      
        <Container>
            <Row>
                <Col sm={12} md={12} lg={12}  className="nsl">
                    <h1>Mima i Maša memori</h1>  
                    <h3>{id_meca}</h3>        
                </Col>

                <Col sm={12} md={12} lg={12}  className="">
                    <header>
                    {igrac_jedan_socket_id}
                        <b>Potez: <span ref={trenutni_potez}>{potez_br}</span> od {ukp_br_poteza}</b>       <b>&nbsp;id meca:&nbsp;{id_meca}</b>

                        

                        
                        <Button id="reset1" ref={resetRef} onClick={  (event) => { resetIgrice(sve_slidze); } } variant="danger" size="lg">Reset</Button>
                        <Link to="/"><Button variant="dark" size="lg">Nazad</Button></Link>
                        <div className="watch">
                            <div className="time" >
                                <b ref={minuti}>{mins<10?"0"+mins:mins} </b>:<b ref={sekunde}> {secs<10? "0"+secs: secs}</b>   
                            </div>
                        </div>
                        {/* {pocetni_modal?<Modal_pocetni/>:null}     */}
                        {pobeda_modal?<Modal_nova_partija resetRef={resetRef}/>:null}                                                
                    </header>
                </Col>
                

         
                <Col sm={12} md={12} lg={12}  className={akt_ne_akt_igrac}>
                           
                        <div  className={game}  ref={okvirRef}   /*id="game" */ >
                            {sve_karte}
                        </div>   
                            
                </Col>


                <Col sm={12} md={12} lg={12}  className="">  
                        <Row>                
                            <Col sm={12} md={6} lg={6}  className={aktivni_igrac_style}>                      
                                    <h6>Igrač 1</h6>
                                    <h3 ref={prvi_igrac_imeRef}>{ime_igraca}</h3>
                                    <h6 ref={prvi_igrac_poeniRef}>{igrac_br_poena}</h6>
                            </Col>
                            <Col sm={12} md={6} lg={6}  className={aktivni_igrac_style2}>
                            {ime_igraca2 ?
                                <span>
                                    <h6>Igrač 2</h6>
                                    <h3 ref={drugi_igrac_imeRef}>{ime_igraca2}</h3>
                                    <h6 ref={drugi_igrac_poeniRef}>{igrac_br_poena2}</h6>
                                </span>
                            :null}    {/* ako je izabran igrac 2 onda ce da pokaze ovaj blok a ko nije nece    */}
                            </Col>
                        </Row> 
                </Col>


                {/* <Col sm={12} md={12} lg={12}  className="watch">
                    
                    <div className="time" >
                    <b ref={minuti}>{mins<10?"0"+mins:mins} </b>:<b ref={sekunde}> {secs<10? "0"+secs: secs}</b>   
                   </div>
                </Col> */}

            </Row>
            </Container>
    </Container>
        
    );

}
export default Glavna;