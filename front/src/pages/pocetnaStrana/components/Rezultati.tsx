import '../css/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css'
import { useState, useEffect } from "react";

function Rezultati() {

    const [tabela, setTabela] = useState<any>();

    const Rezultati_svi = async () => {

        fetch('http://localhost:8000/rezultati', {
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
                   const tabele = <table>
                                        <thead>
                                            <tr>
                                                <th>Ime</th>
                                                <th>Vreme</th>
                                                <th>Potezi</th>
                                                <th>Broj sličica</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((item: any) => {
                                                return (
                                            <tr> 
                                                <td>{item.username}</td>  
                                                <td>{item.vreme}</td>  
                                                <td>{item.potezi}</td>  
                                                <td>{item.br_slicica}</td> 
                                            </tr>
                                                )                           
                                            })}
                                        </tbody>
                                    </table>
                  
                  setTabela(tabele);             
                }
              
            })


    }    
    useEffect(() => { 
        Rezultati_svi();
      }, []);

   return(
    <div>{tabela}</div>
   )
}

export default Rezultati;