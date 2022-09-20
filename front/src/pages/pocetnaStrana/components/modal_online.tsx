/*KADA SE OTVORI MODAL IGRAC VIDI NEKI SVOJ GENERISANI BROJ...KOJI IZDIKTIRA DRUGOM IGRACU TAJ DRUGI IGRAC PRVO */
import 'bootstrap/dist/css/bootstrap.min.css'
import { Button} from 'react-bootstrap';
import { useState, useEffect, useContext, useRef } from "react";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import '../css/index.scss';
import { PocModalContext } from '../../../globalne/PocModalContext';
import { useLocation, useNavigate} from 'react-router-dom';
import axios from "axios";
import * as io from 'socket.io-client';
const socket = io.connect("http://localhost:3001");


interface Tipovi_podataka {
    igrac: number;
    br_slicica: any;
    pocetnaStart:any;
}

function Modal_online(props:Tipovi_podataka) {

    const navigate = useNavigate();
    const {podaci, setPodaci} = useContext<any>(PocModalContext);
    const [show, setShow] = useState(true);
    const [tacan_kanal, setTacan_kanal] = useState<any>(70);
    const handleClose = () => setShow(false);
    const [kanal1, setKanal1] = useState<any>();
    const [prist_mecu, setPrist_mecu] = useState<any>();
    const [igrac, setIgrac] = useState<any>(props.igrac);
    const [igrac2, setIgrac2] = useState<any>(props.igrac);
    const [br_slicica, setBr_slicica] = useState<any>(16/*props.br_slicica*/);  //broj slicica domacina tj prvog igraca...ovo uvek uzima od svog browsera
    const [id_match, setId_match] = useState<any>();
    let id_match1:any = null;
    
    
    const kodRef = useRef<any>();
    const kreirajDugmeRef = useRef<any>();
    const pristupInputRef = useRef<any>();
    const pristupDugmeRef = useRef<any>();
    const startRef = useRef<any>();
    const zatvoriModalRef = useRef<any>();

    /*NEKO KAD KREIRA MEC ON JE AUTOMATSKI PRVI IGRAC,
    1.PRVI IGRAC.....KLIKOM NA DUGME KREIRAJ MEC ON SAMO ULAZI U NEKU RANDOM SOBU I ZAMRZAVA INPUT PRISTUP MECU I DUGMICE PRISTUPI MECU I START U SVOM BROWSERU
    2.DRUGI IGRAC ......(kod njega su i dalje aktivni input i dugmici) KAD POPUNI INPUT (sa brojem koji je dobio od prvog igraca) I KLIKNE NA DUGME PRISTUPI MECU ULAZI U SOBU GDE JE I 
    PRVI IGRAC I U ISTU SOBU SALJE SVOJ ID IGRACA (onaj koji je izabrao drugi igrac)
    3.ONDA SE SETUJE PROMENLJIVA setIgrac2() I ONA OSTAJE VIDLJIVA PRVOM IGRACU 
    4.ZATIM ENABLE DUGME START
    5.PRVI IGRAC KAD KLIKNE NA DUGME START UNOSI MEC U BAZU (imamo razlicite id-eve igraca) (zbog njih je sva muka i bila :) ) I SALJE ID MECA DRUGOM IGRACU TJ SETOVACEMO GA U NEKU
    PROMENLJIVU DA BI MOGLI DA GA VRATIMO U POCETNU KOMPONENTU...TO RADIMO UZ POMOC USECONTEXT
    */



    const kreiraj_mec = () => {
        socket.emit("join_room", kanal1);
        kreirajDugmeRef.current.disabled = true;
        pristupInputRef.current.disabled = true;
        pristupDugmeRef.current.disabled = true;
        startRef.current.disabled = true;
    } 






    /*FCJ ZA DRUGOG IGRACA MOGUCNOST DA SE PRIDRUZI NEKOM VEC KREIRANOM MECU...TJ SOBI*/
    const pristupiMecu = () => {
        socket.emit("join_room", prist_mecu);
        socket.emit("potrazivanje_id_drugog_igraca", {igrac, prist_mecu, kanal1}); //ovo salje drugi igrac svoj id
        kreirajDugmeRef.current.disabled = true;
        pristupInputRef.current.disabled = true;
        pristupDugmeRef.current.disabled = true;
        startRef.current.disabled = true;
    }
    useEffect(() => {     
        socket.on("primanje_id_drugog_igraca", (data) => {
            setIgrac2(data.igrac);
            setPodaci((prevPodaci:any) => [  /*...prevPodaci,*/ {id_igraca2: data.igrac}]);

            if(kodRef.current.innerText != data.kanal1){
                startRef.current.disabled = false;  //prvom igracu enable start dugme a drugom ostaje disable
            }
        });
    },[socket]); 
    /*FCJ ZA DRUGOG IGRACA MOGUCNOST DA SE PRIDRUZI NEKOM VEC KREIRANOM MECU...TJ SOBI*/




    /*OVO SE KREIRA SAMIM POKRETANJEM MODALA - GENERISANJE RANDOM BROJA ROOM-a*/
    const kreiraj_room = () => {
        function makeid(length:number) {
            var result           = '';
            var characters       = '0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() *  charactersLength));
            }
            return result;
        }     
        var unique_kanal =  makeid(4);
        setKanal1(unique_kanal);
     }
     useEffect(() => { 
            kreiraj_room();      
      },[]); 
    /*OVO SE KREIRA SAMIM POKRETANJEM MODALA - GENERISANJE RANDOM BROJA ROOM-a*/





    const startMeca = () => {

                    fetch('http://localhost:8000/dodavanje_meca', {
                        method: 'POST', 
                        headers: {
                        'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            igrac:igrac,igrac2:igrac2,br_slicica:br_slicica
                        })
                    
                    }).then(res => res.json()).then(data => {
                        if(data !== ""){
                            let id_meca = data.id;  
                            setId_match(data.id); 
                            let kanal = kanal1; 
                             
                            id_match1 = data.id;
                            socket.emit("send_message", {id_meca, kanal, igrac, igrac2, br_slicica}); //kad kreiramo mec onda ga saljemo svima...tj i jednom i drugom igracu
                            Sve_slike();
                                           
            }})

    }

; 

    const Sve_slike = async () => {                    
        const response = await axios.post("http://localhost:8000/pregled_slika1", { br_slicica: br_slicica });
        randomSlike(response.data);                    
    }
    const randomSlike = (slika:any) => {   
        setTimeout(async() => {
            prokazSlika([...slika, ...slika]);
            //isPaused = false;
        },200)
    }
    let provera:any = null;
    const prokazSlika = (slika : any) => {   
        slika.sort((_:any) => Math.random() - 0.5);
        if(provera == null){ 
                slika.map( (slika :any) => {
                
                //  fetch('http://localhost:8000/dodavanje_mec_kartica', {
                //     method: 'POST', 
                //     headers: {
                //     'Content-Type': 'application/json'
                //     },
                //     body: JSON.stringify({
                //         id_meca: id_match1, id_kartice: slika.id
                //     })            
                // })



                    axios.post("http://localhost:8000/dodavanje_mec_kartica", { id_meca: id_match1, id_kartice: slika.id  });
                        
                
            });
        }
    }


    useEffect(() => {     
        socket.on("receive_message", (data) => {  //alert('receive_message'+br_slicica ); 
            //alert(data.id_meca);
            //setPodaci((prevPodaci:any) => [  /*...prevPodaci,*/ {id_meca: data.id_meca}]);
            //zatvoriModalRef.current.click(); 
            //props.pocetnaStart.current.click();
            setPodaci((prevPodaci:any) => [  /*...prevPodaci,*/ {da_li_je_online: "online je"}]);  
            navigate("/glavna",{state: {igrac:data.igrac,igrac2:data.igrac2,br_slicica:br_slicica,id_meca:data.id_meca,kanal:data.kanal} }); //ovo i jedneog i drugog igraca prebacuje u sledecu komponentu
        });
      },[socket]); 

 
    return (
        
        <Modal show={show} backdrop="static" keyboard={false}>
            <Modal.Header /*closeButton*/>
                <Modal.Title>Online meč</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>

                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    {/* <Form.Label>Kreiraj meč</Form.Label> */}

                    <div className="form-group kreiraj_mec_mod">
                        <h3 ref={kodRef}>{kanal1}</h3> 
                        <br/>
                        <Button className="form-control select-kanali" ref={kreirajDugmeRef} onClick={kreiraj_mec}>Kreiraj meč</Button>   
                        
                                        
                    </div>

                    {/* <Form.Label>Broj sličica</Form.Label>
                    <div className="form-group">
                               <select  data-placeholder="Broj sličica" className="form-control" value={br_slicica} onChange={(e) => { setBr_slicica(e.target.value);  } }>
					            	<option className="br_slicica" value="8">16</option>
					            	<option className="br_slicica" value="16">32</option>
					            	<option className="br_slicica" value="20">40</option>
                               </select>                     
                    </div> */}

                    </Form.Group>  
<hr/>

                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Protivnikov kod</Form.Label>

                    <div className="form-group">
                        <input placeholder='Protivnikov kod...' ref={pristupInputRef} className="select-kanali sirina_sto"  onChange={  (event) => { setPrist_mecu(event.target.value); } } />   
                        <br/><br/>
                        <Button variant="primary" ref={pristupDugmeRef} className="form-control select-kanali" onClick={ (event) => { pristupiMecu(); /*setShow(false)*/ } }>
                    Pristupi meču
                </Button>

                

                    </div>
                    </Form.Group>             

                </Form>
            </Modal.Body>
            <Modal.Footer>

                <Button variant="primary" ref={startRef} className="form-control select-kanali" onClick={ (event) => { startMeca(); /*setShow(false)*/ } }>
                        Start
                    </Button>

                <Button variant="secondary" ref={zatvoriModalRef} onClick={handleClose}>
                    Zatvori
                </Button>
                {podaci[0].id_meca}
            </Modal.Footer>
        </Modal>
    )
}


export default Modal_online;