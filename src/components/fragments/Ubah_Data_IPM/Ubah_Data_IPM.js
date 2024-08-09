import React, { useState, useEffect, useReducer } from "react";

import styles from "./styles.module.css";
import ipm_provinsiAPI from "../../../api/ipm_provinsiAPI";
import ipm_kab_kotAPI from "../../../api/ipm_kab_kotAPI";
import preventMinus from "../../../hook/preventMinus";

//import component Bootstrap React
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";

const initialState = {
  nama: "",
  tahun: "",
  uhh: "",
  ahls: "",
  arls: "",
  ppd: "",
  iuhh: "",
  ipthn: "",
  iplrn: "",
  ipm: "",
  mgwr: "",
};

const reducer = (currentState, action) => {
  switch (action.type) {
    case "nama":
      return { ...currentState, nama: action.payload };
    case "tahun":
      return { ...currentState, tahun: action.payload };
    case "uhh":
      return { ...currentState, uhh: action.payload };
    case "ahls":
      return { ...currentState, ahls: action.payload };
    case "arls":
      return { ...currentState, arls: action.payload };
    case "ppd":
      return { ...currentState, ppd: action.payload };
    case "iuhh":
      return { ...currentState, iuhh: action.payload };
    case "ipthn":
      return { ...currentState, ipthn: action.payload };
    case "iplrn":
      return { ...currentState, iplrn: action.payload };
    case "ipm":
      return { ...currentState, ipm: action.payload };
    case "mgwr":
      return { ...currentState, mgwr: action.payload };
    default:
      return currentState;
  }
};

export default function Ubah_Data_IPM({
  contentChanger,
  dataFlag,
  tingkatFlag,
  tahunFlag,
  dataProvinsi,
  dataKabKot,
  refreshFlag
}) {
    const [preload, setPreLoad] = useState([]);
    const [tingkat, setTingkat] = useState("Provinsi");
    const [tahun, setTahun] = useState("");
    const [provinsi, setProvinsi] = useState("");
    const [kabkot, setKabKot] = useState(""); 
    const [listKabkot, setListKabkot] = useState([]);
    const [tempPPD, setTempPPD] = useState("");

    const [status, setStatus] = useState(false);
    const [statusKabkot, setStatusKabKot] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [data, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        if(dataFlag !== 0){
            getDataIPM(dataFlag);
        }else{
            setPreLoad(initialState);
        }
    }, []);

    const getDataIPM = async (id) => {
        var res;
        console.log(id, tahunFlag)
        if (tingkatFlag === "Provinsi") {
          res = await ipm_provinsiAPI.getOneProvinsi(id);
        } else {
          res = await ipm_kab_kotAPI.getOneKabKot(id);
        }
        console.log(res.data.data);
        setPreLoad({
        id: res.data.data.id,
        nama: res.data.data.Wilayah.nama_wilayah,
        tahun: res.data.data.tahun,
        uhh: res.data.data.uhh,
        ahls: res.data.data.ahls,
        arls: res.data.data.arls,
        ppd: res.data.data.ppd,
        iuhh: res.data.data.iuhh,
        ipthn: res.data.data.ipthn,
        iplrn: res.data.data.iplrn,
        ipm: res.data.data.ipm,
        mgwr: res.data.data.mgwr,
        });
        setTempPPD(addCommas(removeNonNumeric((res.data.data.ppd * 1000))));
    };

    const submitData = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        console.log(data);

        let uhh, ahls, arls, ppd, iuhh, ipthn, iplrn, ipm, mgwr, id_wilayah, tahunData;

        if (data.uhh !== "" || dataFlag === 0){
            uhh = data.uhh;
        }else{uhh = preload.uhh}

        if (data.ahls !== "" || dataFlag === 0){
            ahls = data.ahls;
        }else{ahls = preload.ahls}

        if (data.arls !== "" || dataFlag === 0){
            arls = data.arls;
        }else{arls = preload.arls}

        if (data.ppd !== "" || dataFlag === 0){
            ppd = data.ppd;
        }else{ppd = preload.ppd}

        if (data.iuhh !== "" || dataFlag === 0){
            iuhh = data.iuhh;
        }else{iuhh = preload.iuhh}

        if (data.ipthn !== "" || dataFlag === 0){
            ipthn = data.ipthn;
        }else{ipthn = preload.ipthn}

        if (data.iplrn !== "" || dataFlag === 0){
            iplrn = data.iplrn;
        }else{iplrn = preload.iplrn}

        if (data.ipm !== "" || dataFlag === 0){
            ipm = data.ipm;
        }else{ipm = preload.ipm}

        if (data.mgwr !== "" || dataFlag === 0){
          mgwr = data.mgwr;
        }else{mgwr = preload.mgwr}

        if(dataFlag === 0){
          if (tingkat === "Provinsi"){
            if (provinsi !== "" && tahun !== ""){
                id_wilayah = parseInt(provinsi); 
                tahunData = parseInt(tahun);
            }else{
              alert("Silahkan Pilih Provinsi dan Tahun")
              return setIsLoading(false);
            }      
          }else{
            if (kabkot !== "" && tahun !== ""){
                id_wilayah = parseInt(kabkot); 
                tahunData = parseInt(tahun);
            }else{
              alert("Silahkan Pilih Kabupaten/Kota dan Tahun")
              return setIsLoading(false);
            }      
          }         
        }
        let temp = 0
        const dataKu = new URLSearchParams({
            "idtemp": parseInt(temp),
            "uhh": parseFloat(uhh),
            "ahls": parseFloat(ahls),
            "arls": parseFloat(arls),
            "ppd": parseInt(ppd),
            "iuhh": parseFloat(iuhh),
            "ipthn": parseFloat(ipthn),
            "iplrn": parseFloat(iplrn),
            "ipm": parseFloat(ipm),
            "mgwr": mgwr,
            "tahun": tahunData
        })

        try{
            var res;

            if(dataFlag === 0){
              if(tingkat === "Provinsi"){
                res = await ipm_provinsiAPI.createDataIPM(id_wilayah, dataKu);
              }else{
                res = await ipm_kab_kotAPI.createDataIPM(id_wilayah, dataKu);
              }
            }else{
              if(tingkatFlag === "Provinsi"){
                res = await ipm_provinsiAPI.editDataIPM(preload.id, dataKu);
              }else{
                res = await ipm_kab_kotAPI.editDataIPM(preload.id, dataKu);
              }
            }
            
            console.log(res)
            if (res.success) {
                alert("Data IPM Berhasil di Simpan")
                setIsLoading(false);
                refreshFlag(true);
                contentChanger("show");
            }else if(res.success === false && res.flag === true){
              alert(res.message)
            }

        }catch(error){
            alert("Data IPM Gagal di Simpan")
        }
        setIsLoading(false);
        
    };

    const tingkatHandler =  (e) => {
        setTingkat(e.target.value)         
        if(e.target.value === "Kabupaten/Kota"){
            setStatus(true);    
        }else{
            setStatus(false);
            setStatusKabKot(true)
        }
    }

    const provinsiHandler = async (e) => {
        setProvinsi(parseInt(e.target.value));
        let temp = [];
        await dataKabKot.forEach((data) => {
            if (data.provinsi_Id === parseInt(e.target.value)){
                temp.push(data);
            } 
        })
        console.log(temp);
        setListKabkot(temp);
        setKabKot("");
        setStatusKabKot(false)
    }

    const listTahun = []
    for (let i=2016; i <= 2030; i++) {
       listTahun.push(<option key={i} value={i}>{i}</option>);  
    };

    const addCommas = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const removeNonNumeric = num => num.toString().replace(/[^0-9]/g, "");

    const handleChangePPD = event => setTempPPD(addCommas(removeNonNumeric((event.target.value * 1000))));

  return (
    <section>
      <Container>
        <Row>
          <h2>
            { dataFlag !== 0 ? <>Ubah Data IPM</>: <>Tambah Data IPM</>}
          </h2>
        </Row>
        <Form className={styles.formEdit} onSubmit={submitData}>
          <Row>
            <Col className={styles.colStyle}>

            { dataFlag === 0 ? (<>              
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="label_form">Pilih Wilayah</Form.Label>
                    <Form.Select aria-label="Default select example" size="sm"
                        defaultValue="Provinsi" value={tingkat} onChange={tingkatHandler}
                    >
                        <option value="Provinsi">Provinsi</option>
                        <option value="Kabupaten/Kota">Kabupaten/Kota</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="label_form">Pilih Provinsi</Form.Label>
                    <Form.Select aria-label="Default select example" size="sm"
                        defaultValue="" value={provinsi} onChange={provinsiHandler}
                    >
                        <option value="" hidden>Pilih Provinsi</option>
                        {dataProvinsi.map((data,i) => {
                            return(<option key={i+1} value={data.id}>{data.nama_wilayah}</option>)
                        })}   
                    </Form.Select>
                </Form.Group>

                {status ? <>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="label_form">Pilih Kabupaten/Kota</Form.Label>
                    <Form.Select aria-label="Default select example" size="sm"
                        value={kabkot} onChange={(e) => setKabKot(e.target.value)} disabled={statusKabkot}
                    >
                        <option value="" hidden>Pilih Kabupaten/Kota</option>
                        {listKabkot && listKabkot.map((data,i) => {
                            return(<option key={i+1} value={data.id}>{data.nama_wilayah}</option>)
                        })}   
                    </Form.Select>
                </Form.Group>
                
                </>:<></>}
                
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="label_form">Pilih Tahun</Form.Label>
                    <Form.Select aria-label="Default select example" size="sm"
                        defaultValue="" value={tahun} onChange={(e) => setTahun(parseInt(e.target.value))}
                    >
                        <option value="" hidden>Pilih Tahun</option>
                        {listTahun}           
                    </Form.Select>
                </Form.Group>
            
            </>):(<>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="label_form">ID</Form.Label>
                <Form.Control
                  size="sm"
                  type="text"
                  name="id"
                  defaultValue={preload.id}
                  disabled
                />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="label_form">Nama Wilayah</Form.Label>
                    <Form.Control
                    size="sm"
                    type="text"
                    name="nama"
                    defaultValue={preload.nama}
                    disabled
                    onBlur={(e) =>
                        dispatch({ type: "nama", payload: e.target.value })
                    }
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="label_form">Tahun</Form.Label>
                    <Form.Control
                    size="sm"
                    type="text"
                    name="tahun"
                    defaultValue={preload.tahun}
                    disabled
                    onBlur={(e) =>
                        dispatch({ type: "tahun", payload: e.target.value })
                    }
                    />
                </Form.Group>       
            </>)}

              
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="label_form">
                  Umur Harapan Hidup
                </Form.Label>
                <Form.Control
                  size="sm"
                  type="number"
                  min="1"
                  name="uhh"
                  onKeyPress={preventMinus}
                  defaultValue={preload.uhh}
                  onBlur={(e) =>
                    dispatch({ type: "uhh", payload: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="label_form">
                  Pendapatan PerKapita Disesuaikan (Rp)
                </Form.Label>
                <Form.Control
                  size="sm"
                  type="number"
                  min="1"
                  name="ppd"
                  onKeyPress={preventMinus}
                  placeholder="10000 (Rp.10.000.000)"
                  defaultValue={preload.ppd}
                  onInput={handleChangePPD}
                  onBlur={(e) =>
                    dispatch({ type: "ppd", payload: e.target.value })
                  }
                />
                  <Form.Text muted>
                    Nilai PPD Asli : Rp. {tempPPD}
                  </Form.Text>
              </Form.Group>
              
            </Col>

            <Col>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="label_form">
                  Angka Harapan Lama Sekolah
                </Form.Label>
                <Form.Control
                  size="sm"
                  type="number"
                  min="1"
                  name="ahls"
                  onKeyPress={preventMinus}
                  defaultValue={preload.ahls}
                  onBlur={(e) =>
                    dispatch({ type: "ahls", payload: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="label_form">
                  Angka Rata-Rata Lama Sekolah
                </Form.Label>
                <Form.Control
                  size="sm"
                  type="number"
                  min="1"
                  name="arls"
                  onKeyPress={preventMinus}
                  defaultValue={preload.arls}
                  onBlur={(e) =>
                    dispatch({ type: "arls", payload: e.target.value })
                  }
                />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="label_form">
                  Indeks Umur Harapan Hidup
                </Form.Label>
                <Form.Control
                  size="sm"
                  type="number"
                  min="0"
                  max="1"
                  name="iuhh"
                  onKeyPress={preventMinus}
                  defaultValue={preload.iuhh}
                  onBlur={(e) =>
                    dispatch({ type: "iuhh", payload: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="label_form">
                  Indeks Pengetahuan
                </Form.Label>
                <Form.Control
                  size="sm"
                  type="number"
                  min="0"
                  max="1"
                  name="ipthn"
                  onKeyPress={preventMinus}
                  defaultValue={preload.ipthn}
                  onBlur={(e) =>
                    dispatch({ type: "ipthn", payload: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="label_form">
                  Indeks Pengeluaran
                </Form.Label>
                <Form.Control
                  size="sm"
                  type="number"
                  min="0"
                  max="1"
                  name="iplrn"
                  onKeyPress={preventMinus}
                  defaultValue={preload.iplrn}
                  onBlur={(e) =>
                    dispatch({ type: "iplrn", payload: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="label_form">
                  Indeks Pembangunan Manusia
                </Form.Label>
                <Form.Control
                  size="sm"
                  type="number"
                  min="0"
                  name="ipm"
                  onKeyPress={preventMinus}
                  defaultValue={preload.ipm}
                  onBlur={(e) =>
                    dispatch({ type: "ipm", payload: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="label_form">
                  Model MGWR
                </Form.Label>
                <Form.Control
                  size="sm"
                  type="text"
                  name="mgwr"
                  defaultValue={preload.mgwr}
                  onBlur={(e) =>
                    dispatch({ type: "mgwr", payload: e.target.value })
                  }
                />
              </Form.Group>
              
              <Row className="btn_group">
                <Col>
                  <Button
                    variant="light"
                    className={styles.buttons}
                    onClick={() => contentChanger("show")}
                  >
                    Kembali
                  </Button>
                  <Button
                    variant="light"
                    disabled={isLoading}
                    className={styles.buttons}
                    type="submit"
                    onClick={submitData}
                  >
                    {isLoading === false ? (
                      <>{ dataFlag !== 0 ? <>Ubah Data</>: <>Tambah Data</>}</>           
                    ) : (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />{" "}
                        Loading...{" "}
                      </>
                    )}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Container>
    </section>
  );
}
