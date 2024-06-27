import React from 'react';
import { useState, useEffect } from "react";

//import component Bootstrap React
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap'

import Leaflet from 'leaflet'
import {
    MapContainer,
    TileLayer,
    Marker,
    GeoJSON,
    Tooltip,
    ZoomControl,
} from 'react-leaflet';

import styles from './styles.module.css';
import Navbars from '../../components/fragments/Navbars';
import kab_kot_map from '../../data/kab_kot_features.json';
import prov_map from '../../data/prov_features.json';
import provinsiAPI from '../../api/provinsiAPI';
import kab_kotAPI from '../../api/kab_kotAPI';
import ipm_provinsiAPI from '../../api/ipm_provinsiAPI';
import ipm_kab_kotAPI from '../../api/ipm_kab_kotAPI';
import calculationAPI from '../../api/calculationAPI';
import Map_Desc from '../../components/fragments/Map_Desc/Map_Desc';
import Modal_Result from '../../components/fragments/Modal_Result/Modal_Result';
import ChangeView from '../../hook/ChangeView';

const arrayText = [ 
    {title:"ipm", text:"Indeks Pembangunan Manusia"}, 
    {title:"uhh", text:"Umur Harapan Hidup"}, 
    {title:"ahls", text:"Angka Harapan Lama Sekolah"}, 
    {title:"arls", text:"Angka Rata-Rata Lama Sekolah"}, 
    {title:"ppd", text:"Pendapatan PerKapita Disesuaikan"}, 
    {title:"iuhh", text:"Indeks Umur Harapan Hidup"}, 
    {title:"ipthn", text:"Indeks Pengetahuan"}, 
    {title:"iplrn", text:"Indeks Pengeluaran"}, 
]

export default function GWR_Maps() {

    const [tingkat, setTingkat] = useState("Nasional");
    const [tahun, setTahun] = useState(2022);
    const [dataType, setdataType] = useState("ipm");

    const [geojson, setGeojson] = useState([]);
    const [dataMap, setDataMap] = useState([]);
    const [dataCalc, setDataCalc] = useState({});

    const [listYear, setListYear] = useState([]);

    const [status, setStatus] = useState(false);
    const [geojsonKey, setgeojsonKey] = useState(null);
    const [textTooltip, setTextTooltip] = useState("");
    const [textDataType, setTextDataType] = useState("");
    const [textDataTingkat, setTextDataTingkat] = useState("Nasional");
    const [tempDataTingkat, setTempDataTingkat] = useState("");
    const [textDataTahun, setTextDataTahun] = useState("");
    const [textDataDesc, setTextDataDesc] = useState("");
    const [loading, setLoading] = useState(false);
    const [modalShow, setModalShow] = useState(false);

    const [centerMap, setCenterMap] = useState([-2.5, 117.55]);
    const [zoomMap, setZoomMap] = useState(4.5);
    const [selectedMap, setSelectedMap] = useState("");

    useEffect(() => {
        getListYear(tingkat);
    }, [])

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

    function findArrayElementByTitle(array, title) {
        return array.find((element) => {
            return element.title === title
        })
    }

    function findRegion(array, name) {
        return array.find((element) => {
            if (textDataTingkat === "Nasional"){
                return element.Provinsi.nama_provinsi === name
            }else{
                return element.Kabupaten_Kotum.nama_kabupaten_kota === name
            }
        })
    }

    const fetchData = async () => {
        console.log("Pilih Peta \nTingkat: ", tingkat, "\nTahun: ", tahun, "\nData: ", dataType)

        let res,resCalc, resGWR, tempTingkat;
        let key = tingkat + "_" + dataType + "_" + String(tahun);

        setLoading(true);

        if(geojsonKey !== key){
            if(tingkat === 'Nasional'){
                console.log("Cari Data Tingkat Nasional")     
                // res = await ipm_provinsiAPI.getDataProvinsi(dataType, tahun);
                // console.log(res.data)  
                resCalc = await calculationAPI.getCalcProvinsi("gwr", tahun);               
                console.log(resCalc.data)   
                resGWR = await calculationAPI.getGWRProvinsi(tahun);   
                console.log(resGWR.data)   
                setGeojson(prov_map);   
                tempTingkat = "Provinsi"
            }else{
                console.log("Cari Data Tingkat Provinsi")
                // res = await ipm_kab_kotAPI.getDataKabKot(dataType, tahun);
                // console.log(res.data)  
                resCalc = await calculationAPI.getCalcProvinsi("gwr", tahun);                      
                console.log(resCalc.data)
                resGWR = await calculationAPI.getGWRKabKot(tahun);
                console.log(resGWR.data)   
                setGeojson(kab_kot_map);   
                tempTingkat = "Kabupaten/Kota"
            }
            setDataMap(resGWR.data.data);
            setDataCalc(resCalc.data.data);   

            if(res !== null){
                setTextDataDesc(dataType.toUpperCase());
                setStatus(true);
                
                setgeojsonKey(key);
                setTextTooltip(dataType)
                console.log("Status Aktif")
                console.log("GeoJSON Key: ", key)

                let tempText = findArrayElementByTitle(arrayText, dataType);
                setTextDataType(tempText.text);
                setTextDataTingkat(tingkat);
                setTempDataTingkat(tempTingkat)
                setTextDataTahun((parseInt(tahun) + 1));
                
                console.log(dataType.toUpperCase())
                setCenterMap([-2.5, 117.55]);   
                setZoomMap(4.5);
                setSelectedMap("");
                setLoading(false);
            }
        }else{return setLoading(false);}
          
    };

    const tingkatHandler =  (e) => {
        setTingkat(e.target.value)   
        console.log(tingkat);
        getListYear(e.target.value);
    }

    const tahunHandler =  (e) => {
        setTahun(e.target.value)   
    }

    const dataTypeHandler =  (e) => {
        setdataType(e.target.value)   
    }

    const positionHandler =  (e) => {
        let position = findRegion(dataMap, e.target.value)
        let latitude, longitude, zoomOption;
        if (textDataTingkat === "Nasional"){
            latitude = position.Provinsi.latitude;
            longitude = position.Provinsi.longitude;
            zoomOption = 8;
        } else{
            latitude = position.Kabupaten_Kotum.latitude;
            longitude = position.Kabupaten_Kotum.longitude;
            zoomOption = 10;
        }
        setCenterMap([latitude, longitude]);   
        setZoomMap(zoomOption);
        setSelectedMap(e.target.value);
    }

    const resetMap = () => {
        setCenterMap([-2.5, 117.55]);   
        setZoomMap(4.5);
        setSelectedMap("");
    }

    const countryStyle = {
        fillOpacity: 0.7,
        color: 'black',
        weight: 2
    };
    
    const onEachRegion = (regionMap, layer) => {
        let dataRegion;
        
        if(tingkat === "Nasional"){
            dataRegion = dataMap.find((element) => {
                return element.provinsi_Id === regionMap.id
            })
        }else{
            dataRegion = dataMap.find((element) => {
                return element.kabupaten_kota_Id === regionMap.id
            })
        }
       
        if (dataRegion !== undefined) {            
          if (dataRegion.value > dataCalc.max) {
            layer.options.fillColor = '#00B8A9';  //#73D737
          } else if (dataRegion.value < dataCalc.min) {
            layer.options.fillColor = '#F6416C';  //#FB4141       
          } else {
            layer.options.fillColor = '#FFDE78';  //#E1FB41
          }
        }    
        
    
        layer.on("click", function () {
        })
    
        layer.on("mouseover", function (e){
            const target = e.target;
            target.setStyle({
                color: 'black',
                fillOpacity: 0.9,
                weight: 2
            })
        })
    
        layer.on("mouseout", function (e){
            const target = e.target;
            target.setStyle({
                fillOpacity: 0.7,
                color: 'black',
                weight: 2
            })
        })  
    };

    return (
        <div>
        <Container fluid>
            <Navbars/>

            {/* Content Section */}
            <section>
                <div>
                    <Row>
                        {/* Choose Map Section */}
                        <Col md={2}>
                            <Row>
                                <div className={styles.titleSection}>Pilih Peta GWR</div>
                            </Row>
                            {/* Pilih Tingkat */}
                            <Row>
                                <div className={styles.dropdownField}>
                                    <p className={styles.dropdownTitle}>Tingkat</p>
                                    <select name="tingkat" id="tingkat" className={styles.dropdownStyle}
                                        onChange={tingkatHandler} value={tingkat}
                                    >
                                          <option value="Nasional">Tingkat Provinsi</option>
                                          <option value="Provinsi">Tingkat Kabupaten/Kota</option>
                                    </select>
                                </div>
                            </Row>
                             {/* Pilih Tahun */}
                            <Row>
                                <div className={styles.dropdownField}>
                                    <p className={styles.dropdownTitle}>Tahun Data</p>
                                    <select name="Tahun" id="Tahun" className={styles.dropdownStyle}
                                        onChange={tahunHandler} value={tahun}
                                    >
                                        {listYear && listYear.map((data) => {
                                            return(<option value={data.tahun}>{data.tahun}</option>)
                                        })}
                                    </select>
                                </div>
                            </Row>
                            {/* Button */}
                            <Row>
                                <Button onClick={fetchData} variant="light" className={styles.buttons} disabled={loading}>  
                                    {loading ? (<>
                                        <Spinner animation="border" role="status" size="sm"classNames={styles.mapSpinner}>
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner> {" "} Loading...
                                    </>):(<>Pilih Peta</>)}
                                   
                                </Button>
                            </Row>
                            {/* Result Button & Cari Wilayah */}
                            {
                                status && loading === false ?(
                                    <>
                                    
                                    <Row>
                                        <div className={styles.titleSection}></div>
                                        <div className={styles.dropdownField}>
                                            <p className={styles.dropdownTitle}>Cari Wilayah</p>
                                            <select name="tingkat" id="tingkat" className={styles.dropdownStyle}
                                                onChange={positionHandler} value={selectedMap}
                                            >
                                                <option value="" selected disabled hidden>Pilih Wilayah</option>
                                                {
                                                    dataMap.map((data) => {
                                                        let nama;
                                                        if(textDataTingkat === "Nasional"){
                                                            nama = data.Provinsi.nama_provinsi;
                                                        }else{
                                                            nama = data.Kabupaten_Kotum.nama_kabupaten_kota;
                                                        }
                                                        return(
                                                            <option value={nama}>{nama}</option>
                                                        )
                                                    })
                                                }
                                                  
                                            </select>
                                        </div>
                                    </Row>
                                    <Row>
                                        <Button variant="light" className={styles.buttons} onClick={resetMap}>
                                            Reset Peta
                                        </Button>      
                                    </Row>
                                    <Row className={styles.rowHasil}>
                                        <div className={styles.titleSection}></div>
                                        <Button variant="light" onClick={() => setModalShow(true)} className={styles.buttons}>
                                            Lihat Hasil
                                        </Button>       
                                    </Row>
                                    </>
                                ):(<></>)
                            }
                            
                        </Col>
                        {/* Map Section */}
                        <Col>
                            <Row className={styles.rowMap}>
                                <div className={styles.mapTitle}>Peta {'  '}
                                     {'  '}
                                    {status === true ?(<>Prediksi Indeks Pembangunan Manusia Tingkat {tempDataTingkat} di </>):(<></>)}{' '}
                                    Indonesia 
                                     {' '}
                                    {status === true ?(<>Tahun {textDataTahun}</>):(<></>)}
                                </div>
                            </Row>
                            <Row className={styles.rowMap}>
                                <div className={styles.mapField}>      
                               
                                    {/* Map */}
                                    <MapContainer center={centerMap} zoom={zoomMap} zoomControl={false} scrollWheelZoom={true} className={styles.mapStyles}>
                                        <ChangeView center={centerMap} zoom={zoomMap} /> 
                                        <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />

                                   
                                        {dataMap && dataMap.map((i, idx) => {
                                            let namaWilayah, latitude, longitude, valueData, valueIPM, diff;
                                            if (textDataTingkat === "Nasional"){
                                                namaWilayah = i.Provinsi?.nama_provinsi;
                                                latitude = i.Provinsi?.latitude;
                                                longitude = i.Provinsi?.longitude;
                                            }else{
                                                namaWilayah = i.Kabupaten_Kotum?.nama_kabupaten_kota;
                                                latitude = i.Kabupaten_Kotum?.latitude;
                                                longitude = i.Kabupaten_Kotum?.longitude;
                                            }
                                            valueData = i.value;
                                            valueIPM = i.ipm;
                                            diff = (i.value - i.ipm).toFixed(3);
                                        return(
                                            <>
                                                <Marker key={idx}
                                                    position={[latitude || '', longitude || '']}
                                                    eventHandlers={{
                                                    click: () => {
                                                        // handleClick(i.ProvinsiId, i.Provinsi?.nama_provinsi)
                                                    },
                                                    }}
                                                >
                                                    <Tooltip>
                                                    <b>{namaWilayah}</b>
                                                    <p>
                                                        {valueData !== null || valueData !== undefined ||valueData !== 0 ?(
                                                            <>
                                                                <>IPM {textDataTahun} : {valueData}</><br></br>
                                                                <>IPM {textDataTahun -1} : {valueIPM}</><br></br>
                                                                <>Selisih     : {diff}</>
                                                            </>
                                                        ):(<>Data tidak tersedia</>)}                                           
                                                    </p>
                                                    </Tooltip>
                                                </Marker>
                                            </>
                                            
                                        )})}

                             
                                        {   status === true ?(
                                            <>
                                                <GeoJSON
                                                key={geojsonKey}
                                                style={countryStyle}
                                                data={geojson}
                                                onEachFeature={onEachRegion}
                                                />
                                                
                                            </>
                                            ):(<></>)
                                        }                                     
                                        <ZoomControl position="topright" />
                                        
                                    </MapContainer>

                                    {/* Map Desc */}
                                    {status === true ?(
                                        <Map_Desc handleClickSet={true} max={dataCalc.max} min={dataCalc.min} dataType={textDataDesc}/>
                                    ):(<></>)}
                                    
                                </div>  
                                           
                            </Row>
                        </Col>
                        
                    </Row>
                </div>
            </section>   
            {/* Modal Result */}
            {status ?(<>
                <Modal_Result
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    max={dataCalc.max}
                    min={dataCalc.min}
                    data={dataMap}
                    tingkat={textDataTingkat}
                    tahun={textDataTahun}
                    textDataType={'Prediksi'}
                    dataType={textDataDesc}
                />      
            </>):(<></>)}
               
        </Container>
        </div>
    );
}
