import '../css/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container,  Row, Col, Button} from 'react-bootstrap';
import { useState, useEffect, useContext, useRef} from "react";
import { useNavigate  } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import uvod from '../../../slike/uvod.gif';
import Rezultati from './Rezultati';
import Modal_online from './modal_online';

//import { PocModalContext } from '../../../globalne/PocModalContext';

//import axios from "axios";
//import * as io from 'socket.io-client';

//const socket = io.connect("http://localhost:3001");



function Pocetna(props:any) {

    //const {podaci, setPodaci} = useContext<any>(PocModalContext);
   // podaci[0].kanal  //ovde imamo podatak o ID MECA koji je vidljiv za oba browsera tj oba igraca
    const start = useRef<any>();
    
    // const [vezba, setVezba] = useState<any>("");
    // const [vezba1, setVezba1] = useState<any>("");
    const [modal_online, setModal_online] = useState<any>(false);

    const [select_igrac, setSelect_igrac] = useState<any>();
    const [select_igrac2, setSelect_igrac2] = useState<any>();
    // const [br_igraca, setBr_igraca] = useState<any>(1);
    const [igrac, setIgrac] = useState<any>();
    const [igrac2, setIgrac2] = useState<any>();
    const [br_poteza, setBr_poteza] = useState<any>(50);
    const [br_slicica, setBr_slicica] = useState<any>(16);
    //const [id_meca, setId_meca] = useState<any>();
    const navigate = useNavigate();
    //let id_meca:any;
   // let online_id_meca = podaci[0].id_meca;

    const sacuvajPodesavanja = () => {
        
        if(typeof igrac2 != 'undefined'){
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
                        //setId_meca(data.id); 
                        //id_meca = data.id;
                        //alert(id_meca);   
                        navigate("/glavna",{state: {igrac:igrac,igrac2:igrac2,br_poteza:br_poteza,br_slicica:br_slicica,id_meca:data.id} });       
                    }})
        }else{
            navigate("/glavna",{state: {igrac:igrac,igrac2:igrac2,br_poteza:br_poteza,br_slicica:br_slicica} });
        }       
        
        
    }


    const Igraci = async () => {

        fetch('http://localhost:8000/igraci', {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
             
            })
           
          })
            .then(res => res.json())
            .then(data => {
              if(data !== ""){
                  setIgrac(data[0].id);           
                  const svi_igraci = <select data-placeholder="Igrači"  className="form-control" value={igrac}    onChange={(e) => {setIgrac(e.target.value);} }>
                                         {data.map((item: any) => {
                                              return (                                           
                                                  <option key={item.id} value={item.id}>{item.username}</option>                                         
                                              )                           
                                          })}
                                      </select>
                                      
                        setSelect_igrac(svi_igraci);               
               }
              
            })


    }


    const Igraci2 = async () => {

        fetch('http://localhost:8000/igraci', {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
             
            })
           
          })
            .then(res => res.json())
            .then(data => {
              if(data !== ""){
                  //setIgrac(data[0].id);           
                  const svi_igraci = <select data-placeholder="Igrači"  className="form-control" value={igrac2}    onChange={(e) => {setIgrac2(e.target.value);} }>
                                         <option value=''>---</option>  
                                         {data.map((item: any) => {
                                              return (                                           
                                                  <option key={item.id} value={item.id}>{item.username}</option>                                         
                                              )                           
                                          })}
                                      </select>
                                      
                            setSelect_igrac2(svi_igraci);               
               }
              
            })


    }

    useEffect(() => { 
        Igraci();
        Igraci2();
        
      }, []); 
    



    //POZIVANJE MODALA
      const online = () => { //alert(modal_online)
        if(modal_online == true){
            setModal_online(false);
        }else{
            setModal_online(true);
        }
        
    }
    //POZIVANJE MODALA


    
    //ODABIR KANALA IZ MODALA ZA IGRANJE
    //   const joinRoom = () => {
    //      socket.emit("join_room", kanal);
    //      //setVezba1(vezba);
    //   }
    //   useEffect(() => { 
    //     joinRoom();  
    //   }, [kanal]); 
      //ODABIR KANALA IZ MODALA ZA IGRANJE

/*IZ MODALA ONLINE UZIMAMO BROJ KANALA I SETUJEMO USECONTEXT. NA OVOJ STRANICI SE POZIVAMO NA TU VREDNOST I NJU KROZ PROMENLJIVU kanal SALJEMO NA SOCKET SERVER A ON DALJE OSLUSKUJE 
DA LI JE JOS NEKO IZABRAO TAJ KANAL*/
 

      //const sendMessage = () => {

                // fetch('http://localhost:8000/dodavanje_meca', {
        //             method: 'POST', 
        //             headers: {
        //             'Content-Type': 'application/json'
        //             },
        //             body: JSON.stringify({
        //                 igrac:igrac,igrac2:igrac2,br_slicica:br_slicica
        //             })
                
        //         }).then(res => res.json()).then(data => {
        //             if(data !== ""){
        //                 let id_meca = data.id;   
        //                 socket.emit("send_message", {id_meca, kanal}); //kad kreiramo mec onda ga saljemo svima...tj i jednom i drugom igracu
        //                 //navigate("/glavna",{state: {igrac:igrac,igrac2:igrac2,br_poteza:br_poteza,br_slicica:br_slicica,id_meca:data.id} });       
        //             }})


        //socket.emit("send_message", {vezba, kanal});
        //socket.emit("send_message", {message: vezba});
        //start.current.click();
     //}


    //   useEffect(() => { 
      
    //     socket.on("receive_message", (data) => {
    //         //alert(data.message);
    //         alert(data.id_meca);
    //         setVezba1(data.id_meca);
    //         //start.current.click();
    //     });
    //   },[socket]); 

    return (
            

        <Container fluid id="klijenat_izm">   
        <img className="d-block w-100" id="uvod" src={uvod} alt="uvod"/>
        {modal_online?<Modal_online igrac={igrac} br_slicica={br_slicica} pocetnaStart={start}/>:null}    
        <Container>
            <Row>
                <Col sm={12} md={12} lg={12}  className="start_podesavanje">
<br/>

        {/* <input placeholder='Poruka...' onChange={(event) => {
            setVezba(event.target.value)
        }}/> */}
        {/* <button onClick={sendMessage}>Posalji poruku</button> */}
{/* {vezba1} */}
        <h1>Mima i Maša memori</h1> 
            
        {/* <div id="login_box_ceo">
            
            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg" id="login_box"> */}
        
            <Form>
                    {/* <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        
                    <Form.Label>Broj igrača</Form.Label>

                    <div className="form-group">
                                <select  data-placeholder="Broj poteza" className="form-control" value={br_igraca} onChange={(e) => { setBr_igraca(e.target.value); } }>
                                    <option className="br_poteza" value="1">1</option>
                                    <option className="br_poteza" value="2">2</option>
                                </select>                     
                    </div>
                    </Form.Group>   */}


                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        
                    <Form.Label>Izbor igrača 1</Form.Label>

                    <div className="form-group">
                                {select_igrac}                     
                    </div>
                    </Form.Group>  

                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        
                    <Form.Label>Izbor igrača 2</Form.Label>

                    <div className="form-group">
                                {select_igrac2}                     
                    </div>
                    </Form.Group>  


                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        
                    <Form.Label>Broj poteza</Form.Label>

                    <div className="form-group">
                               <select  data-placeholder="Broj poteza" className="form-control" value={br_poteza} onChange={(e) => { setBr_poteza(e.target.value); } }>
                                   	<option className="br_poteza" value="100">100</option>
					            	<option className="br_poteza" value="75">75</option>
					            	<option className="br_poteza" value="50">50</option>
					            	<option className="br_poteza" value="25">25</option>
                               </select>                     
                    </div>
                    </Form.Group>                   

                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Broj sličica</Form.Label>
                    <div className="form-group">
                               <select  data-placeholder="Broj sličica" className="form-control" value={br_slicica} onChange={(e) => { setBr_slicica(e.target.value);  } }>
					            	<option className="br_slicica" value="8">16</option>
					            	<option className="br_slicica" value="16">32</option>
					            	<option className="br_slicica" value="20">40</option>
                               </select>                     
                    </div>
                    </Form.Group>

                    <Button className="btn btn-primary form-control" onClick={online}>Online</Button>
                    <br/><br/>
                        <button type="button" id="logovanje" ref={start} className="btn btn-danger form-control" onClick={  (event) => { sacuvajPodesavanja(); } }>Start<i className="bi-arrow-bar-right"></i></button>
                   
                    
                </Form>
                
                
                {/* </div>	
            </div> */}
            </Col>

            <Col sm={12} md={12} lg={12}  className="rez_tab">
                <h2>Solo rezultati</h2>
                {<Rezultati/>}
            </Col>
            <Col sm={12} md={12} lg={12}  className="rez_tab">
                <h2>Medjusobni rezultati</h2>
                {<Rezultati/>}
            </Col>
            </Row>  
           </Container> 
        </Container> 
    )
}


export default Pocetna;