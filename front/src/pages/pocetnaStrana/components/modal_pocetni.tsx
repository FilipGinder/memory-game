import 'bootstrap/dist/css/bootstrap.min.css'
import { Button} from 'react-bootstrap';
import { useState, useEffect, useContext } from "react";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
//import { propTypes } from 'react-bootstrap/esm/Image';

import { PocModalContext } from "../../../globalne/PocModalContext"

function Modal_pocetni(props:any) {

    const {podaci, setPodaci} = useContext(PocModalContext);
    const [show, setShow] = useState(false);
    const [br_poteza, setBr_poteza] = useState<any>(50);
    const [br_slicica, setBr_slicica] = useState<any>(16);
    
    useEffect(() => {
        const timeoutID = setTimeout(() => {
            setShow(true);
        }, 1000);
    
        return () => {
          clearTimeout(timeoutID);
        };
      }, []);

    const sacuvajPodesavanja = () => {
        setPodaci(() => [{br_poteza: br_poteza, br_slicica:br_slicica}]);
    }
 
    return (
        
        <Modal show={show} backdrop="static" keyboard={false}>
            <Modal.Header /*closeButton*/>
                <Modal.Title>Podešavanje</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
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
                                   	<option className="br_slicica" value="8">8</option>
					            	<option className="br_slicica" value="16">16</option>
					            	<option className="br_slicica" value="32">32</option>
					            	<option className="br_slicica" value="64">64</option>
                               </select>                     
                    </div>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                {/* <Button variant="secondary" onClick={handleClose}>
                    Zatvori
                </Button> */}
                <Button variant="primary" onClick={ (event) => { sacuvajPodesavanja(); setShow(false) } }>
                    Start
                </Button>
            </Modal.Footer>
        </Modal>
    )
}


export default Modal_pocetni;