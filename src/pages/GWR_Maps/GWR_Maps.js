import React from 'react';
import { useState, useEffect } from "react";

//import component Bootstrap React
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap'
import Select from 'react-select'
import {
    MapContainer,
    TileLayer,
    Marker,
    GeoJSON,
    Tooltip,
    ZoomControl,
    LayersControl, LayerGroup
} from 'react-leaflet';

import styles from './styles.module.css';
import Navbars from '../../components/fragments/Navbars';
import kab_kot_map from '../../data/kab_kot_features.json';
import prov_map from '../../data/prov_features.json';
import ipm_provinsiAPI from '../../api/ipm_provinsiAPI';
import ipm_kab_kotAPI from '../../api/ipm_kab_kotAPI';
import calculationAPI from '../../api/calculationAPI';
import Map_Desc from '../../components/fragments/Map_Desc/Map_Desc';
import Modal_Result from '../../components/fragments/Modal_Result/Modal_Result';
import ChangeView from '../../hook/ChangeView';
import findRegion from '../../hook/findRegion';

const arrayText = [ 
    {title:"ipm", text:"Indeks Pembangunan Manusia"}, 
    {title:"intercept", text:"Intercept"}, 
    {title:"iuhh", text:"Indeks Umur Harapan Hidup"}, 
    {title:"ipthn", text:"Indeks Pengetahuan"}, 
    {title:"iplrn", text:"Indeks Pengeluaran"}, 
]

export default function GWR_Maps() {

    const [tingkat, setTingkat] = useState("Provinsi");
    const [tahun, setTahun] = useState(2022);
    const [dataType, setdataType] = useState("iuhh");

    const [geojson, setGeojson] = useState([]);
    const [dataMap, setDataMap] = useState([]);
    const [dataCalc, setDataCalc] = useState({});

    const [listYear, setListYear] = useState([]);

    const [status, setStatus] = useState(false);
    const [geojsonKey, setgeojsonKey] = useState(null);
    const [textTooltip, setTextTooltip] = useState("");
    const [textDataType, setTextDataType] = useState("");
    const [textDataTingkat, setTextDataTingkat] = useState("Provinsi");
    const [tempDataTingkat, setTempDataTingkat] = useState("");
    const [textDataTahun, setTextDataTahun] = useState("");
    const [textDataDesc, setTextDataDesc] = useState("");
    const [loading, setLoading] = useState(true);
    const [modalShow, setModalShow] = useState(false);

    const [centerMap, setCenterMap] = useState([-2.5, 117.55]);
    const [zoomMap, setZoomMap] = useState(4.5);
    const [selectedMap, setSelectedMap] = useState("");

    useEffect(() => {
        setLoading(true);
        getListYear(tingkat);
        setLoading(false);
    }, [])

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

    function findArrayElementByTitle(array, title) {
        return array.find((element) => {
            return element.title === title
        })
    }

    const fetchData = async () => {
        console.log("Pilih Peta \nTingkat: ", tingkat, "\nTahun: ", tahun, "\nData: ", dataType)

        let resCalc, resGWR, tempTingkat;
        let key = tingkat + "_" + dataType + "_" + String(tahun);

        setLoading(true);

        if(geojsonKey !== key){
            if(tingkat === 'Provinsi'){
                console.log("Cari Data Tingkat Provinsi")     
                resCalc = await calculationAPI.getCalcGWRProvinsi(dataType, tahun);               
                console.log(resCalc.data)   
                resGWR = await calculationAPI.getGWRProvinsi(tahun);   
                console.log(resGWR.data)  
                setGeojson(prov_map);   
                tempTingkat = "Provinsi"
            }else{
                console.log("Cari Data Tingkat Kabupaten/Kota") 
                resCalc = await calculationAPI.getCalcGWRKabKot(dataType, tahun);                      
                console.log(resCalc.data)
                resGWR = await calculationAPI.getGWRKabKot(tahun);
                console.log(resGWR.data) 
                setGeojson(kab_kot_map);   
                tempTingkat = "Kabupaten/Kota"
            }
            setDataMap(resGWR.data.data);
            setDataCalc(resCalc.data.data);   

            if(resCalc !== null){
                setTextDataDesc(dataType.toUpperCase());
                setStatus(true);
                
                setgeojsonKey(key);
                setTextTooltip(dataType.toUpperCase())
                console.log("Status Aktif")
                console.log("GeoJSON Key: ", key)

                let tempText = findArrayElementByTitle(arrayText, dataType);
                setTextDataType(tempText.text);
                setTextDataTingkat(tingkat);
                setTempDataTingkat(tempTingkat)
                setTextDataTahun(tahun);
                
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

    const positionHandler =  (e) => {
        let position = findRegion(dataMap, e.Wilayah.nama_wilayah, true)
        let zoomOption;
        if (textDataTingkat === "Provinsi"){
            zoomOption = 8;
        } else{
            zoomOption = 10;
        }
        setCenterMap([position.Wilayah.latitude, position.Wilayah.longitude]);   
        setZoomMap(zoomOption);
        setSelectedMap(e);
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
        let dataRegion, value, regionName;

        dataRegion = dataMap.find((element) => {
            return element.Wilayah.id === regionMap.id
        })

        if(textDataDesc === "IUHH"){value = dataRegion?.iuhh}
        else if(textDataDesc === "IPTHN"){value = dataRegion?.ipthn}
        else if(textDataDesc === "IPLRN"){value = dataRegion?.iplrn}
        else {value = dataRegion?.intercept}
       
        if (dataRegion !== undefined) {  
            if (value > dataCalc.max) {
                layer.options.fillColor = '#00B8A9';  //#73D737
              } else if (value < dataCalc.min) {
                layer.options.fillColor = '#F6416C';  //#FB4141       
              } else {
                layer.options.fillColor = '#FFDE78';  //#E1FB41
              }
        } 
        regionName = dataRegion?.Wilayah.nama_wilayah     
    
        layer.on("mouseover", function (e){
            const target = e.target;
            target.setStyle({
                color: 'black',
                fillOpacity: 0.95,
                weight: 4
            })
            layer.bindTooltip(` <p><b>${regionName}</b><br />Estimasi ${textTooltip} : ${value}</p> `, {direction: "center"}).openTooltip();
        })
    
        layer.on("mouseout", function (e){
            const target = e.target;
            target.setStyle({
                fillOpacity: 0.8,
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
                                <div className={styles.titleSection}>Pilih Peta MGWR</div>
                            </Row>
                            {/* Pilih Tingkat */}
                            <Row>
                                <div className={styles.dropdownField}>
                                    <p className={styles.dropdownTitle}>Tingkat</p>
                                    <select name="tingkat" id="tingkat" className={styles.dropdownStyle}
                                        onChange={tingkatHandler} value={tingkat}
                                    >
                                          <option value="Provinsi">Tingkat Provinsi</option>
                                          <option value="Kabupaten/Kota">Tingkat Kabupaten/Kota</option>
                                    </select>
                                </div>
                            </Row>
                             {/* Pilih Tahun */}
                            <Row>
                                <div className={styles.dropdownField}>
                                    <p className={styles.dropdownTitle}>Tahun Data</p>
                                    <select name="Tahun" id="Tahun" className={styles.dropdownStyle}
                                        onChange={(e) => setTahun(e.target.value)} value={tahun}
                                    >
                                        {listYear && listYear.map((data,i) => {
                                            return(<option key={i} value={data.tahun}>{data.tahun}</option>)
                                        })}
                                    </select>
                                </div>
                            </Row>
                             {/* Pilih Data */}
                             <Row>
                                <div className={styles.dropdownField}>
                                    <p className={styles.dropdownTitle}>Parameter</p>
                                    <select name="Data" id="Data" className={styles.dropdownStyle}
                                        onChange={(e) => setdataType(e.target.value)} value={dataType}
                                    >  
                                        <option value="iuhh">Indeks Umur Harapan Hidup (IUHH)</option>
                                        <option value="ipthn">Indeks Pengetahuan (IPTHN)</option>
                                        <option value="iplrn">Indeks Pengeluaran (IPLRN)</option>
                                        {/* <option value="intercept">Intercept</option> */}
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
                                             <Select 
                                                getOptionLabel={option => option.Wilayah.nama_wilayah}
                                                getOptionValue={option => option.Wilayah.nama_wilayah}
                                                options={dataMap}
                                                onChange={(e) => positionHandler(e)}
                                                value={selectedMap}
                                                className={styles.selectRegion}
                                                placeholder="Pilih Wilayah"
                                            />
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
                                    {status === true ?(<>Estimasi Parameter {textDataType} Tingkat {tempDataTingkat} di </>):(<></>)}{' '}
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
                                        

                                        <LayersControl position="topright">
                                            <LayersControl.Overlay checked name="Marker">
                                                <LayerGroup>
                                           
                                        {dataMap && dataMap.map((data, idx) => {
                                            let value;
                                            if(dataType === "iuhh"){value = data.iuhh}
                                            else if(dataType === "ipthn"){value = data.ipthn}
                                            else if(dataType === "iplrn"){value = data.iplrn}
                                            else {value = data.intercept}

                                            value = value.toFixed(5)
                                        return(
                                            <>

                                                <Marker key={idx}
                                                    position={[data.Wilayah.latitude || '', data.Wilayah.longitude || '']}
                                                >
                                                    <Tooltip>
                                                    <b>{data.Wilayah.nama_wilayah}</b>
                                                    <p>
                                                        {value !== null || value !== undefined ||value !== 0 ?(
                                                            <>
                                                                <>Estimasi {textTooltip} : {value}</><br></br>
                                                            </>
                                                        ):(<>Data tidak tersedia</>)}                                           
                                                    </p>
                                                    </Tooltip>
                                                </Marker>
                                            </>
                                            
                                        )})}
                                                </LayerGroup>
                                            </LayersControl.Overlay> 
                                        </LayersControl>

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
                                                                         
                                        <ZoomControl position="topleft" />                           
                                    </MapContainer>

                                    {/* Map Desc */}
                                    {status === true ?(
                                        <Map_Desc handleClickSet={true} max={dataCalc.max} min={dataCalc.min} gwrflag={true} dataType={textDataDesc}/>
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
                    gwrflag={true}
                    data={dataMap}
                    tingkat={textDataTingkat}
                    tahun={textDataTahun}
                    textDataType={textDataType}
                    dataType={textDataDesc}
                />      
            </>):(<></>)}
               
        </Container>
        </div>
    );
}
