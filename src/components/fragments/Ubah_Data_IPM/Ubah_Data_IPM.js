import React, { useState, useEffect, useReducer } from "react";

import styles from "./styles.module.css";
import ipm_provinsiAPI from "../../../api/ipm_provinsiAPI";
import ipm_kab_kotAPI from "../../../api/ipm_kab_kotAPI";

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
  gwr: "",
};

const listYear = [2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,2026];

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
    case "gwr":
      return { ...currentState, gwr: action.payload };
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
    const [tingkat, setTingkat] = useState("Nasional");
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
        var res, temp;
        console.log(id, tahunFlag)
        if (tingkatFlag === "Nasional") {
        res = await ipm_provinsiAPI.getOneProvinsi(id);

        temp = res.data.data.Provinsi.nama_provinsi;
        } else {
        res = await ipm_kab_kotAPI.getOneKabKot(id);
        temp = res.data.data.Kabupaten_Kotum.nama_kabupaten_kota;
        }
        console.log(res.data.data);
        setPreLoad({
        id: res.data.data.id,
        nama: temp,
        tahun: res.data.data.tahun,
        uhh: res.data.data.uhh,
        ahls: res.data.data.ahls,
        arls: res.data.data.arls,
        ppd: res.data.data.ppd,
        iuhh: res.data.data.iuhh,
        ipthn: res.data.data.ipthn,
        iplrn: res.data.data.iplrn,
        ipm: res.data.data.ipm,
        gwr: res.data.data.gwr,
        });
        setTempPPD(addCommas(removeNonNumeric((res.data.data.ppd * 1000))));
    };

    const submitData = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        console.log(data);

        let uhh, ahls, arls, ppd, iuhh, ipthn, iplrn, ipm, gwr, id_wilayah, tahunData;

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

        if (data.gwr !== "" || dataFlag === 0){
          gwr = data.gwr;
        }else{gwr = preload.gwr}

        if(dataFlag === 0){
          if (tingkat === "Nasional"){
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
            "gwr": gwr,
            "tahun": tahunData
        })

        try{
            var res;

            if(dataFlag === 0){
              if(tingkat === "Nasional"){
                res = await ipm_provinsiAPI.createDataIPM(id_wilayah, dataKu);
              }else{
                res = await ipm_kab_kotAPI.createDataIPM(id_wilayah, dataKu);
              }
            }else{
              if(tingkatFlag === "Nasional"){
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
        if(e.target.value === "Provinsi"){
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

    const kabkotHandler = (e) => {
        setKabKot(e.target.value);
    }

    const tahunHandler = (e) => {
        setTahun(parseInt(e.target.value));
    }

    const showYear = () =>{
        for (let i = 2020; i < 2030; i++) {    
            console.log(i)      
            return(<option key={i} value={i}>{i}</option>)          
        }
    }

    const addCommas = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const removeNonNumeric = num => num.toString().replace(/[^0-9]/g, "");

    const handleChange = event =>
      setTempPPD(addCommas(removeNonNumeric((event.target.value * 1000))));

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
                        defaultValue="Nasional" value={tingkat} onChange={tingkatHandler}
                    >
                        <option value="Nasional">Provinsi</option>
                        <option value="Provinsi">Kabupaten/Kota</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="label_form">Pilih Provinsi</Form.Label>
                    <Form.Select aria-label="Default select example" size="sm"
                        defaultValue="" value={provinsi} onChange={provinsiHandler}
                    >
                        <option value="" hidden>Pilih Provinsi</option>
                        {dataProvinsi.map((data,i) => {
                            return(<option key={i+1} value={data.id}>{data.nama_provinsi}</option>)
                        })}   
                    </Form.Select>
                </Form.Group>

                {status ? <>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="label_form">Pilih Kabupaten/Kota</Form.Label>
                    <Form.Select aria-label="Default select example" size="sm"
                        value={kabkot} onChange={kabkotHandler} disabled={statusKabkot}
                    >
                        <option value="" hidden>Pilih Kabupaten/Kota</option>
                        {listKabkot && listKabkot.map((data,i) => {
                            return(<option key={i+1} value={data.id}>{data.nama_kabupaten_kota}</option>)
                        })}   
                    </Form.Select>
                </Form.Group>
                
                </>:<></>}
                
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="label_form">Pilih Tahun</Form.Label>
                    <Form.Select aria-label="Default select example" size="sm"
                        defaultValue="" value={tahun} onChange={tahunHandler}
                    >
                        <option value="" hidden>Pilih Tahun</option>
                        {/* { showYear() } */}
                        {listYear.map((data,i) => {
                            return(<option key={i+1} value={data}>{data}</option>)
                        })}   
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
                  type="text"
                  name="uhh"
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
                  type="text"
                  name="ppd"
                  placeholder="10000 (Rp.10.000.000)"
                  defaultValue={preload.ppd}
                  onInput={handleChange}
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
                  type="text"
                  name="ahls"
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
                  type="text"
                  name="arls"
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
                  type="text"
                  name="iuhh"
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
                  type="text"
                  name="ipthn"
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
                  type="text"
                  name="iplrn"
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
                  type="text"
                  name="ipm"
                  defaultValue={preload.ipm}
                  onBlur={(e) =>
                    dispatch({ type: "ipm", payload: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="label_form">
                  Prediksi GWR
                </Form.Label>
                <Form.Control
                  size="sm"
                  type="text"
                  name="gwr"
                  defaultValue={preload.gwr}
                  onBlur={(e) =>
                    dispatch({ type: "gwr", payload: e.target.value })
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
