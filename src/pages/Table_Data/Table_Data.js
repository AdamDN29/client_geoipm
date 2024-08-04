import React from 'react';
import { useState, useEffect } from 'react';

import styles from './styles.module.css';
import ImgAsset from '../../assets';
import Navbars from '../../components/fragments/Navbars/Navbars';
import Tables from '../../components/fragments/Tables/Tables';
import ExportData from '../../hook/exportData';
import findRegion from '../../hook/findRegion';

import ipm_provinsiAPI from '../../api/ipm_provinsiAPI';
import ipm_kab_kotAPI from '../../api/ipm_kab_kotAPI';
import provinsiAPI from '../../api/provinsiAPI';
import kab_kotAPI from '../../api/kab_kotAPI';

//import component Bootstrap React
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap'


export default function Table_Data() {

    const [dataProvinsi, setDataProvinsi] = useState([]);
    const [dataKabKot, setDataKabKot] = useState([]);
    
    const [tingkat, setTingkat] = useState("Provinsi");
    const [tahun, setTahun] = useState("all");
    const [provinsi, setProvinsi] = useState("all");
    const [kabkot, setKabKot] = useState("");

    const [listYear, setListYear] = useState([]);
    const [listKabKot, setListKabKot] = useState([]);

    const [dataTable, setDataTable] = useState([]);

    const [status, setStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [found, setFound] = useState(false);
    const [statusKabKot, setStatusKabKot] = useState(true);

    const [textTingkat, setTextTingkat] = useState("Provinsi");
    const [textTahun, setTextTahun] = useState("");
    const [textTitle, setTextTitle] = useState("");
    
    useEffect(() => {
        setLoading(true);
        getDataWilayah();
        getListYear(tingkat);
        setLoading(false);
    }, [])

    // function findRegion(array, name) {
    //     return array.find((element) => {
    //         return element.nama_wilayah === name
    //     })
    // }

    // function findKabKot(array, name) {
    //     return array.find((element) => {
    //         return element.nama_kabupaten_kota === name
    //     })
    // }

    const getDataWilayah = async () => {
        const prov = await provinsiAPI.getAllProvinsi();
        const kabkot = await kab_kotAPI.getAllKabKot();
        setDataProvinsi(prov.data.data);
        setDataKabKot(kabkot.data.data);
    }

    const getListYear = async (dataTingkat) => {
        console.log("Tingkat: ",dataTingkat)
        let temp;
        if(dataTingkat === "Provinsi"){
            temp = await ipm_provinsiAPI.getDataProvinsiYear();
        }else{
            temp = await ipm_kab_kotAPI.getDataKabKotYear();
        }
        console.log("List Year :", temp.data.data)
        setListYear(temp.data.data);
        console.log("Get List Year")
    }

    const fetchData = async () =>{
        let res, wilayah;
        setStatus(false);
        setLoading(true);
        
        if (tingkat === "Provinsi"){
            console.log("Provinsi", provinsi)
            if(provinsi === "all"){
                res = await ipm_provinsiAPI.getAllDataProvinsi(tahun); 
                wilayah = "Seluruh Provinsi di Indonesia"

            }else{
                const temp = findRegion(dataProvinsi, provinsi, false)
                res = await ipm_provinsiAPI.getOneDataProvinsi(temp.id, tahun);
                wilayah = temp.nama_wilayah
            }
            
        }else{
            if (provinsi === "all"){
                res = await ipm_kab_kotAPI.getAllDataKabKot(tahun); 
                wilayah = "Seluruh Kabupaten/Kota di Indonesia"       
            }else{
                if(kabkot === "all"){
                    const temp = findRegion(dataProvinsi, provinsi, false);
                    res = await ipm_kab_kotAPI.getManyDataKabKot(temp.id, tahun);
                    wilayah = "Seluruh Kabupaten/Kota di " + temp.nama_wilayah
                }else{
                    const temp = findRegion(dataKabKot, kabkot, false)
                    res = await ipm_kab_kotAPI.getOneDataKabKot(temp.id, tahun);  
                    wilayah = temp.nama_wilayah  
                }   
            }          
        }
        console.log(res.data)
        if (res.data.sucess === false){
            setStatus(false);
            setFound(true);
            console.log("Data Tidak Ditemukan")
        }else{
            setTextTingkat(tingkat);
            setTextTahun(tahun);

            var temp = res.data.data;
            var dataTemp = [];
            if(temp[0] === undefined){
                dataTemp = [temp];
            }else{
                dataTemp = temp;
            }
            console.log("DataTemp:", dataTemp)
            
            setDataTable(dataTemp);
            setStatus(true);
            setLoading(false);
            setFound(true);
            if (tahun === 'all'){
                setTextTitle(wilayah)
            }else{
                setTextTitle(wilayah + " Tahun " + tahun)
            }
        }   
        setLoading(false);       
    }

    const tingkatHandler =  (e) => {
        setTingkat(e.target.value)         
        getListYear(e.target.value);
        if(e.target.value === "Kabupaten/Kota"){
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

            let provFlag = findRegion(dataProvinsi, e.target.value, false); 
            
            dataKabKot.forEach((data) => {
                if (data.provinsi_Id === provFlag.id){
                    temp.push(data);
                } 
            })
            console.log(temp)
            setListKabKot(temp);
            setKabKot("all");
            setStatusKabKot(false);
        }
    }

    const resetFilter = () => {
        setDataTable([]);
        setStatus(false);
        setFound(false);
        setTextTingkat("")
        setTextTahun("")
        setTextTitle("")
        setStatusKabKot(true);
        setProvinsi("all");
        setKabKot("");
        setTahun("all")
    }

    return (
        <div>
        <Container fluid>
            <Navbars/>
         
            <section>
                <div>
                    <Row>
                        {/* Choose Data Section */}
                        <Col md={2}>
                            <Row>
                                <div className={styles.titleSection}>Pilih Data</div>
                            </Row>

                            {/* Pilih Tingkat */}
                            <Row>
                                <div className={styles.dropdownField}>
                                    <p className={styles.dropdownTitle}>Pilih Pencarian</p>
                                    <select name="tingkat" id="tingkat" className={styles.dropdownStyle}
                                        onChange={tingkatHandler} value={tingkat}
                                    >
                                          <option value="Provinsi">Cari Provinsi</option>
                                          <option value="Kabupaten/Kota">Cari Kabupaten/Kota</option>
                                    </select>
                                </div>
                            </Row>

                            {/* Pilih Provinsi */}
                            <Row>
                                <div className={styles.dropdownField}>
                                    <p className={styles.dropdownTitle}>Provinsi</p>
                                    <select name="provinsi" id="provinsi" className={styles.dropdownStyle}
                                        onChange={provinsiHandler} value={provinsi} 
                                    >
                                        {/* <option value="" selected disabled hidden>Pilih Provinsi</option> */}
                                        <option value="all" selected>Seluruh Provinsi</option>
                                            { dataProvinsi && dataProvinsi.map((data, i) => {
                                                    return(
                                                        <option key={i} value={data.nama_wilayah} >{data.nama_wilayah}</option>
                                                    )
                                                })
                                            }
                                    </select>
                                </div>
                            </Row>

                            {/* Pilih Kabupaten/Kota */}
                            <Row>
                                {
                                    tingkat === "Kabupaten/Kota" ?(
                                        <div className={styles.dropdownField}>
                                            <p className={styles.dropdownTitle}>Kabupaten/Kota</p>
                                            <select name="kabkot" id="kabkot" className={styles.dropdownStyle}
                                                onChange={(e) => setKabKot(e.target.value)} value={kabkot} disabled={statusKabKot}
                                            >
                                                <option value="" selected disabled hidden>Pilih Kabupaten/Kota</option>
                                                <option value="all" >Seluruh Kabupaten/Kota</option>
                                                    { listKabKot && listKabKot.map((data, i) => {
                                                            return(
                                                                <option key={i} value={data.nama_wilayah}>{data.nama_wilayah}</option>
                                                            )
                                                        })
                                                    }
                                            </select>
                                        </div>
                                    ):(<></>)
                                }
                               
                            </Row>

                             {/* Pilih Tahun */}
                            <Row>
                                <div className={styles.dropdownField}>
                                    <p className={styles.dropdownTitle}>Tahun</p>
                                    <select name="Tahun" id="Tahun" className={styles.dropdownStyle}
                                        onChange={(e) => setTahun(e.target.value)} value={tahun}
                                    >
                                        <option value="all">Seluruh Tahun</option>
                                        {listYear && listYear.map((data, i) => {
                                            return(<option key={i} value={data.tahun}>{data.tahun}</option>)
                                        })}
                                    </select>
                                </div>
                            </Row>
                            {/* Button Pilih Data */}
                            <Row>
                                <Button variant="light" className={styles.buttons} onClick={fetchData} disabled={loading}>
                                    {loading ? (<>
                                        <Spinner animation="border" role="status" size="sm"classNames={styles.mapSpinner}>
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner> {" "} Loading...
                                    </>):(<>Pilih Data</>)}
                                </Button>  
                            </Row>
                            {/* Button Reset */}
                            <Row>
                                <Button variant="light" className={styles.buttons} onClick={resetFilter}>
                                    Reset
                                </Button>  
                            </Row>
                            {/* Button Unduh Data */}
                            <Row>
                                {status ? (
                                    <>
                                        <div className={styles.titleSection}></div>
                                        <ExportData excelData={dataTable} fileName={"Tabel Data IPM " + textTitle} flag={"Data"}/>
                                    </>
                                ):(<></>)}        
                            </Row>       
                        </Col>

                        {/* Table Data Section */}
                        <Col className={styles.colData}>
                            <Row >
                                <div className={styles.titleSection}>Tabel Data IPM {" "} 
                                    {textTitle}
                                </div>
                            </Row>
                            <Row>
                                <div className={styles.tableField}>
                                {
                                    status ?(
                                        <Tables tableFlag={"showIPM"} textTingkat={textTingkat} dataTable={dataTable} actionFlag={false}/>
                                    ) :(<>
                                        <center>
                                            <img
                                                src = {ImgAsset.Search_Image}
                                                width="350"
                                                height="400"
                                                // className={styles.search_image}
                                                alt="Search"  
                                            />
                                             { loading ? <p className={styles.titleSection}>Loading...</p> :
                                                <>
                                                    {
                                                        !found ? <p className={styles.titleSection}>Silahkan Pilih Data</p>:
                                                        <p className={styles.titleSection}>Data Tidak Ditemukan</p>
                                                    }
                                                </>    
                                            }
                                        </center>
                                        
                                    </>)
                                }
                                
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </div>

                <div>
                   
                </div>

            </section>           
        </Container>
        </div>
    );
}
