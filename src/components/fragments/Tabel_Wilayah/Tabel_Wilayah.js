import React, { useState, useEffect } from 'react';

import styles from './styles.module.css';
import ImgAsset from '../../../assets';
import provinsiAPI from '../../../api/provinsiAPI';
import kab_kotAPI from '../../../api/kab_kotAPI';
import Tables from '../Tables/Tables';
import Ubah_Data_Wilayah from '../Ubah_Data_Wilayah/Ubah_Data_Wilayah';

//import component Bootstrap React
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap'

export default function Tabel_Wilayah({listProvinsi, listKabKot, refreshStatus}) {   
   
    const [tingkat, setTingkat] = useState("Provinsi");
    const [provinsi, setProvinsi] = useState("all");
    const [kabkot, setKabKot] = useState("");

    const [tempKabKot, setTempKabKot] = useState([]);

    const [dataTable, setDataTable] = useState([]);

    const [status, setStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [found, setFound] = useState(true);
    const [statusKabKot, setStatusKabKot] = useState(true);

    const [textTingkat, setTextTingkat] = useState("Provinsi");

    const [content, setContent] = useState("show");
    const [dataFlag, setDataFlag] = useState(null);
    const [refresh, setRefresh] = useState(false);

    // function findData(array, id) {
    //     return array.find((element) => {
    //         return element.id === id
    //     })
    // }

    const fetchData = async () => {
        let res;
        setStatus(false);
        setLoading(true);
        setFound(false);    

        if (tingkat === "Provinsi"){  

           
            if(provinsi === "all"){
                res = await provinsiAPI.getAllProvinsi();   
            }else{             
                res = await provinsiAPI.getOneProvinsi(parseInt(provinsi))
            }         
        }else{ 
            if (provinsi === "all"){
                res = await kab_kotAPI.getAllKabKot();
            }else{
                if(kabkot === "all"){   
                    res = await kab_kotAPI.getKabKotbyProvinsi(parseInt(provinsi));
                }else{   
                    res = await kab_kotAPI.getOneKabKot(parseInt(kabkot)); 
                }
            }     
        }

        if(res.data.succes === false){
            setStatus(false);
            setFound(false);
        }else{
            var temp = res.data.data;
            var dataTemp = [];
            if(temp[0] === undefined){
                dataTemp = [temp];
            }else{
                dataTemp = temp;
            }
            console.log("DataTemp:", dataTemp)
            setDataTable(dataTemp); 
            setFound(true);
            setTextTingkat(tingkat);          
            setStatus(true);     
        }
        setLoading(false);
    }

    const tingkatHandler =  (e) => {
        setTingkat(e.target.value)         
        if(e.target.value === "Kabupaten/Kota"){  
            setProvinsi("all"); 
            setKabKot("");    
            setStatusKabKot(true);    
        }else{
            setStatusKabKot(true);
            setProvinsi("all");
            setKabKot("");
        }
    }

    const provinsiHandler =  (e) => {
        setProvinsi(e.target.value);
        
        if(e.target.value === 'all' || e.target.value === ""){
            setStatusKabKot(true);
            setKabKot("");
        }else{
            let temp = [];

            listKabKot.forEach((data) => {
                if (data.provinsi_Id === parseInt(e.target.value)){
                    temp.push(data);
                } 
            })
            setTempKabKot(temp);
            
            if(tingkat === "Provinsi"){setStatusKabKot(true);}
            else{setKabKot("all"); setStatusKabKot(false);}
        }
    }

    if(refresh === true){
        refreshStatus(true)
        fetchData();
        setRefresh(false);
    }

    const showContent = () => {
        if (content === "show"){
            return (
                <Container >
                    <Row>
                        <h2>Data Wilayah</h2>
                    </Row>
                    <Row className={styles.rowSection}>
                        <Col className={styles.colStyle}>
                            <Row>
                                <Col xs={2}>
                                    <p className={styles.dropdownTitle}>Pilih Wilayah</p>
                                </Col>
                                <Col xs={3}>
                                    <p className={styles.dropdownTitle}>Pilih Provinsi</p>
                                </Col>
                                <Col>
                                    <p className={styles.dropdownTitle}>Pilih Kabupaten/Kota</p>
                                </Col>
                                <Col xs={2}>
                                    <Button variant="light" className={styles.buttons} onClick={() => setContent("create")}>
                                        Tambah Data
                                    </Button>  
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={2}>
                                    <select name="tingkat" id="tingkat" className={styles.dropdownStyle}
                                        onChange={tingkatHandler} value={tingkat}
                                    >
                                        <option value="Provinsi">Provinsi</option>
                                        <option value="Kabupaten/Kota">Kabupaten/Kota</option>
                                    </select>
                                </Col>
                                <Col xs={3}>
                                    <select name="provinsi" id="provinsi" className={styles.dropdownStyle}
                                        onChange={provinsiHandler} value={provinsi} 
                                    >
                                        <option value="all" selected>Seluruh Provinsi</option>
                                            { listProvinsi && listProvinsi.map((data, i) => {
                                                return(<option key={i} value={data.id}>{data.nama_wilayah}</option>)
                                        })}
                                    </select>
                                </Col>
                                <Col>
                                    <select name="kabkot" id="kabkot" className={styles.dropdownStyle}
                                        onChange={(e) => setKabKot(e.target.value)} value={kabkot} disabled={statusKabKot}
                                    >
                                        <option value="" selected disabled hidden>Pilih Kabupaten/Kota</option>
                                        <option value="all" >Seluruh Kabupaten/Kota</option>
                                            { tempKabKot && tempKabKot.map((data, i) => {
                                                return(<option key={i} value={data.id}>{data.nama_wilayah}</option>)
                                            })}
                                    </select>
                                </Col>
                                <Col xs={2}>
                                    <Button variant="light" className={styles.buttons} onClick={fetchData} disabled={loading}>
                                        {loading ? (<>
                                            <Spinner animation="border" role="status" size="sm"classNames={styles.mapSpinner}>
                                                <span className="visually-hidden">Loading...</span>
                                            </Spinner> {" "} Loading...
                                        </>):(<>Pilih Data</>)}
                                    </Button>  
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    {/* <Row className={styles.rowSection}>
                        <div className={styles.titleSection}>Tabel Data Wilayah {" "} 
                            {textTitle}
                        </div>
                    </Row> */}
                    <Row>
                        { status ?(
                                <Tables contentChanger={setContent} dataChanger={setDataFlag} tableFlag={"showWilayah"} textTingkat={textTingkat} textTahun={"textTahun"} dataTable={dataTable} actionFlag={true} refreshFlag={setRefresh}/>
                            ) :(<>
                                <center>
                                    <img
                                        src = {ImgAsset.Search_Image}
                                        width="250"
                                        height="300"
                                        alt="Search"  
                                    />
                                    { found ? <p className={styles.titleSection}>Silahkan Pilih Data</p> :
                                        <>
                                            {
                                                loading ? <p className={styles.titleSection}>Loading...</p>:
                                                <p className={styles.titleSection}>Data Tidak Ditemukan</p>
                                            }
                                        </>    
                                    }
                                </center>
                        </>)}
                    </Row>
                    
                </Container>
            )
        }else if(content === "edit"){
            return(
                <Ubah_Data_Wilayah contentChanger={setContent} dataFlag={dataFlag} tingkatFlag={textTingkat} refreshFlag={setRefresh}/>
            )

        }else if(content === "create"){
            return(
                <Ubah_Data_Wilayah contentChanger={setContent} dataFlag={0} tingkatFlag={textTingkat} dataProvinsi={listProvinsi} refreshFlag={setRefresh}/>
            )
        }

    }

    return (
        <section>
           {showContent()}
        </section>
    );
}
