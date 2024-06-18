import React, { useState, useEffect } from 'react';

import styles from './styles.module.css';
import ImgAsset from '../../../assets';
import provinsiAPI from '../../../api/provinsiAPI';
import kab_kotAPI from '../../../api/kab_kotAPI';
import ipm_provinsiAPI from '../../../api/ipm_provinsiAPI';
import ipm_kab_kotAPI from '../../../api/ipm_kab_kotAPI';
import Tables from '../Tables/Tables';
import Ubah_Data_IPM from '../Ubah_Data_IPM/Ubah_Data_IPM';

//import component Bootstrap React
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap'

export default function Tabel_IPM() {
    
    const [dataProvinsi, setDataProvinsi] = useState([]);
    const [dataKabKot, setDataKabKot] = useState([]);
    
    const [tingkat, setTingkat] = useState("Nasional");
    const [tahun, setTahun] = useState("all");
    const [provinsi, setProvinsi] = useState("all");
    const [kabkot, setKabKot] = useState("");

    const [listYear, setListYear] = useState([]);
    const [listKabKot, setListKabKot] = useState([]);

    const [dataTable, setDataTable] = useState([]);

    const [status, setStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [found, setFound] = useState(true);
    const [statusKabKot, setStatusKabKot] = useState(true);

    const [textTingkat, setTextTingkat] = useState("Nasional");
    const [textTahun, setTextTahun] = useState("");
    const [textTitle, setTextTitle] = useState("");

    const [content, setContent] = useState("show");
    const [dataFlag, setDataFlag] = useState(null);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        getDataWilayah();
        getListYear(tingkat);
        setLoading(false);
        
    }, [])

    

    function findProv(array, name) {
        return array.find((element) => {
            return element.nama_provinsi === name
        })
    }

    function findKabKot(array, name) {
        return array.find((element) => {
            return element.nama_kabupaten_kota === name
        })
    }

    const getListYear = async (dataTingkat) => {
        console.log("Tingkat: ",dataTingkat)
        let temp;
        if(dataTingkat === "Nasional"){
            temp = await ipm_provinsiAPI.getDataProvinsiYear();
        }else{
            temp = await ipm_kab_kotAPI.getDataKabKotYear();
        }
        console.log("List Year :", temp.data.data)
        setListYear(temp.data.data);
        console.log("Get List Year")
    }

    const fetchData = async () => {
        let res;
        setStatus(false);
        setLoading(true);
        setFound(false);
        if (tingkat === "Nasional"){    
            if(provinsi === "all"){
                res = await ipm_provinsiAPI.getAllDataProvinsi(tahun);
                setTextTitle("Seluruh Provinsi di Indonesia")
            }else{
                const temp = findProv(dataProvinsi, provinsi);
                res = await ipm_provinsiAPI.getOneDataProvinsi(temp.id, tahun);
                setTextTitle(provinsi)
            }
        }else{ 
            if (provinsi === "all"){
                res = await ipm_kab_kotAPI.getAllDataKabKot(tahun); 
                setTextTitle("Seluruh Kabupaten/Kota di Indonesia")
            }else{
                if(kabkot === "all"){   
                    const temp = findProv(dataProvinsi, provinsi);
                    res = await ipm_kab_kotAPI.getManyDataKabKot(temp.id, tahun);
                    setTextTitle("Seluruh Kabupaten/Kota di " + provinsi)   
                }else{   
                    const temp = findKabKot(dataKabKot, kabkot);
                    res = await ipm_kab_kotAPI.getOneDataKabKot(temp.id, tahun);  
                    setTextTitle(kabkot);  
                }
            } 
            
        }

        if(res.data.succes === false || res.data.data.length === 0){
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

            dataTemp = dataTemp.map(function(obj,i) {

                if(tingkat === "Nasional"){
                    obj['nama_wilayah'] = obj.Provinsi.nama_provinsi;
                }else{
                    obj['nama_wilayah'] = obj.Kabupaten_Kotum.nama_kabupaten_kota;
                }
                return obj;
            })
            setDataTable(dataTemp);   
            setFound(true);
            setTextTingkat(tingkat);  
            setTextTahun(tahun);  
            
            setStatus(true); 
        }
        setLoading(false);
    }

    const getDataWilayah = async () => {
        const prov = await provinsiAPI.getAllProvinsi();
        const kabkot = await kab_kotAPI.getAllKabKot();
        setDataProvinsi(prov.data.data);
        setDataKabKot(kabkot.data.data);
    }

    const tingkatHandler =  (e) => {
        setTingkat(e.target.value)
        getListYear(e.target.value)          
        if(e.target.value === "Provinsi"){
            // setStatusProv(false);  
            setProvinsi("all"); 
            setKabKot("");    
            setStatusKabKot(true);   
            
        }else{
            // setStatusProv(true);
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

            let provFlag = findProv(dataProvinsi, e.target.value); 

            dataKabKot.forEach((data) => {
                if (data.provinsi_Id === provFlag.id){
                    temp.push(data);
                } 
            })
            setListKabKot(temp);
            
            if(tingkat === "Nasional"){setStatusKabKot(true);}
            else{setKabKot("all"); setStatusKabKot(false);}
        }
    }

    const kabkotHandler =  (e) => {
        setKabKot(e.target.value)   
    }

    const tahunHandler =  (e) => {
        setTahun(e.target.value);   
    }

    if(refresh === true){
        fetchData();
        getListYear(tingkat);
        setRefresh(false);
    }

    const showContent = () => {
        if (content === "show"){
            return(
                <Container>
                <Row>
                    <h2>Tabel Data IPM</h2>
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
                                <p className={styles.dropdownTitle}>Pilih Tahun</p>
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
                                    <option value="Nasional">Provinsi</option>
                                    <option value="Provinsi">Kabupaten/Kota</option>
                                </select>
                            </Col>
                            <Col xs={3}>
                                <select name="provinsi" id="provinsi" className={styles.dropdownStyle}
                                     onChange={provinsiHandler} value={provinsi} 
                                >
                                    <option value="all" selected>Seluruh Provinsi</option>
                                        { dataProvinsi && dataProvinsi.map((data, i) => {
                                            let nama = data.nama_provinsi;
                                            return(<option key={i} value={nama}>{nama}</option>)
                                    })}
                                </select>
                            </Col>
                            <Col>
                                <select name="kabkot" id="kabkot" className={styles.dropdownStyle}
                                    onChange={kabkotHandler} value={kabkot} disabled={statusKabKot}
                                >
                                    <option value="" selected disabled hidden>Pilih Kabupaten/Kota</option>
                                    <option value="all" >Seluruh Kabupaten/Kota</option>
                                        { listKabKot && listKabKot.map((data, i) => {
                                            let nama = data.nama_kabupaten_kota;
                                            return(<option key={i} value={nama}>{nama}</option>)
                                        })}
                                </select>
                            </Col>
                            <Col xs={2}>
                                <select name="Tahun" id="Tahun" className={styles.dropdownStyle}
                                        onChange={tahunHandler} value={tahun}
                                    >
                                        <option value="all">Seluruh Tahun</option>
                                        {listYear && listYear.map((data, i) => {
                                            return(<option key={i} value={data.tahun}>{data.tahun}</option>)
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
                            <Tables contentChanger={setContent} dataChanger={setDataFlag} tableFlag={"showIPM"} textTingkat={textTingkat} textTahun={textTahun} dataTable={dataTable} actionFlag={true} refreshFlag={setRefresh}/>
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
        }else if (content === "edit"){
            return(
                <Ubah_Data_IPM contentChanger={setContent} dataFlag={dataFlag} tingkatFlag={textTingkat} tahunFlag={textTahun} refreshFlag={setRefresh}/>
            )        
        }else if (content === "create"){
            return(
                <Ubah_Data_IPM contentChanger={setContent} dataFlag={0} tingkatFlag={textTingkat} tahunFlag={textTahun} dataProvinsi={dataProvinsi} dataKabKot={dataKabKot} refreshFlag={setRefresh}/>
            )
        }
    }

    return (
        <section>            
            {showContent()}        
        </section>
    );
}