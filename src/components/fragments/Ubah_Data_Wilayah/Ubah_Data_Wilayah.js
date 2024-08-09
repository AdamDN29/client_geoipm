import React, { useState, useEffect, useReducer } from "react";

import styles from "./styles.module.css";
import provinsiAPI from "../../../api/provinsiAPI";
import kab_kotAPI from "../../../api/kab_kotAPI";

//import component Bootstrap React
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";

const initialState = {
  nama: "",
  latitude: "",
  longitude: "",
};

const reducer = (currentState, action) => {
  switch (action.type) {
    case "nama":
      return { ...currentState, nama: action.payload };
    case "latitude":
      return { ...currentState, latitude: action.payload };
    case "longitude":
      return { ...currentState, longitude: action.payload };
    default:
      return currentState;
  }
};

export default function Ubah_Data_Wilayah({
  contentChanger,
  dataFlag,
  tingkatFlag,
  dataProvinsi,
  refreshFlag
}) {
    const [preload, setPreLoad] = useState([]);
    const [tingkat, setTingkat] = useState("Provinsi");
    const [provinsi, setProvinsi] = useState("");

    const [status, setStatus] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [data, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        if(dataFlag !== 0){
            getDataWilayah(dataFlag);
        }else{
            setPreLoad(initialState);
        }
    }, []);

    const getDataWilayah = async (id) => {
        var res, temp;
        console.log(id)
        if (tingkatFlag === "Provinsi") {
            res = await provinsiAPI.getOneProvinsi(id);
            temp = "None";
        } else {
            res = await kab_kotAPI.getOneKabKot(id);
            temp = res.data.data.Provinsi.nama_provinsi;
        }
        console.log(res.data.data);
        setPreLoad({
            id: res.data.data.id,
            nama: res.data.data.nama_wilayah,
            latitude: res.data.data.latitude,
            longitude: res.data.data.longitude,
            provinsiName: temp
        });
    };

    const submitData = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        console.log(data);

        let nama, latitude, longitude;

        if (data.nama !== "" || dataFlag === 0){
            nama = data.nama;
        }else{nama = preload.nama}

        if (data.latitude !== "" || dataFlag === 0){
            latitude = data.latitude;
        }else{latitude = preload.latitude}

        if (data.longitude !== "" || dataFlag === 0){
            longitude = data.longitude;
        }else{longitude = preload.longitude}

        console.log("Nama:", nama, " latitude: ", latitude, " longitude: ", longitude)
        if (nama === "" && latitude === "" && longitude === ""){
            alert("Silahkan Lengkapi Data")
            return setIsLoading(false);
        }  
        if (dataFlag === 0 && tingkat !== "Provinsi" && provinsi === ""){
            alert("Silahkan Lengkapi Data")
            return setIsLoading(false);
        }
       
        const dataKu = new URLSearchParams({
            "nama_wilayah": nama,
            "latitude": parseFloat(latitude),
            "longitude": parseFloat(longitude),
            "provinsi_Id": parseInt(provinsi)
        })

        try{
            var res;

            if(dataFlag === 0){
              if(tingkat === "Provinsi"){
                res = await provinsiAPI.createDataWilayah(dataKu);
              }else{
                res = await kab_kotAPI.createDataWilayah(dataKu);
              }
              console.log("Create Data")
            }else{
              if(tingkatFlag === "Provinsi"){
                res = await provinsiAPI.editDataWilayah(preload.id, dataKu);
              }else{
                res = await kab_kotAPI.editDataWilayah(preload.id, dataKu);
              }
              console.log("Edit Data")
            }
            
            console.log(res)
            if (res.success) {
                alert("Data Wilayah Berhasil di Simpan")
                setIsLoading(false);
                refreshFlag(true);
                contentChanger("show")
            }else if(res.success === false && res.flag === true){
              alert(res.message)
            }

        }catch(error){
            alert("Data Wilayah Gagal di Simpan")
        }
        setIsLoading(false);
        
    };

    const tingkatHandler =  (e) => {
        setTingkat(e.target.value)         
        if(e.target.value === "Kabupaten/Kota"){
            setStatus(true);    
        }else{
            setStatus(false);
        }
    }

    const provinsiHandler = async (e) => {
        setProvinsi(parseInt(e.target.value));
    }

  return (
    <section>
      <Container>
        <Row>
          <h2>
            { dataFlag !== 0 ? <>Ubah Data Wilayah</>: <>Tambah Data Wilayah</>}
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

                { tingkat !== "Provinsi"?(
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
                ):(<></>)}         
            
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

                {tingkatFlag !== "Provinsi"?(
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className="label_form">Provinsi</Form.Label>
                        <Form.Control
                            size="sm"
                            type="text"
                            name="provinsi"
                            defaultValue={preload.provinsiName}
                            disabled
                        />
                 </Form.Group>       
                ):(<></>)}
                
            </>)}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="label_form">Nama Wilayah</Form.Label>
                    <Form.Control
                    size="sm"
                    type="text"
                    name="nama_wilayah"
                    defaultValue={preload.nama}
                    onBlur={(e) =>
                        dispatch({ type: "nama", payload: e.target.value })
                    }
                    />
                </Form.Group>
              
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="label_form">
                  Latitude
                </Form.Label>
                <Form.Control
                  size="sm"
                  type="number"
                  name="latitude"
                  defaultValue={preload.latitude}
                  onBlur={(e) =>
                    dispatch({ type: "latitude", payload: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="label_form">
                  Longitude
                </Form.Label>
                <Form.Control
                  size="sm"
                  type="number"
                  name="longitude"
                  defaultValue={preload.longitude}
                  onBlur={(e) =>
                    dispatch({ type: "longitude", payload: e.target.value })
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
