import { useState, createContext, useMemo} from "react";

export const PocModalContext = createContext<any>(null);

export const PocModalProvider = (props: any) => {

    const [podaci, setPodaci] = useState<any>([
      {
        id_meca: null, //podatak koji koriste dva razlicita igraca, browsera
        id_igraca2: null,
        da_li_je_online:null
        //vreme_trajanja: null
      }
    ]);

    const value = useMemo(() => ({
        podaci, setPodaci
    }), [podaci, setPodaci]);

    return(
      <PocModalContext.Provider value={value}>
          {props.children}
      </PocModalContext.Provider>
    );
  };
