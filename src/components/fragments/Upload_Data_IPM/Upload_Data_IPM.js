import React, { useEffect, useState } from 'react';

import styles from './styles.module.css'
import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';
import provinsiAPI from '../../../api/provinsiAPI';
import kab_kotAPI from '../../../api/kab_kotAPI';
import ipm_provinsiAPI from "../../../api/ipm_provinsiAPI";
import ipm_kab_kotAPI from "../../../api/ipm_kab_kotAPI";
import ImgAsset from '../../../assets';


//import component Bootstrap React
import { Container, Row, Col, Form, Button, Spinner, Table } from 'react-bootstrap'

export default function Dashboard() {

    const [tingkat, setTingkat] = useState("Nasional");
    const [tahun, setTahun] = useState("");
    const [loading, setLoading] = useState(false);
    const [found, setFound] = useState(false);
    const [status, setStatus] = useState(false);
    const [flag, setFlag] = useState(false);
    
    const [textTingkat, setTexTingkat] = useState("Provinsi");

    const [lastData, setLastData] = useState();
    const [dataTable, setDataTable] = useState([]);
    const [dataUpload, setDataUpload] = useState([]);
    const [totalUpload, setTotalUpload] = useState(0);

    useEffect(() => {
        
    },[])

    const getLast = async (temp) => {
        let res;
        console.log(temp)
        if(temp === "Nasional"){
            res = await ipm_provinsiAPI.getLastData();
        }else{
            res = await ipm_kab_kotAPI.getLastData();
        }
        setLastData(res);
        console.log(res);
    }
    
    const fetchData = async () => {
        let res;
        setLoading(true);
        setFound(false);
        if(tahun === "" || tahun < 2000){
            alert("Silahkan Isi Tahun dengan benar")
            return setLoading(false);
        }

        if(tingkat === "Nasional"){
            res = await provinsiAPI.getAllProvinsi();
        }else{
            res = await kab_kotAPI.getAllKabKot();
        }
        console.log(res.data)
        if(res.data.succes === false){
            setFound(false);
        }else{
            setFound(true);
            setDataTable(res.data.data);    
        }
        setLoading(false);
    }

    const tingkatHandler =  (e) => {
        if (e.target.value === "Nasional"){
            setTexTingkat("Provinsi")
        }else{setTexTingkat("Kabupaten/Kota")}
        setTingkat(e.target.value)             
    }

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const convertData = async (dataTable) => {
        const dataKu = dataTable.map((data,i) => {
            let name;
            if (tingkat === "Nasional"){
                name = data.nama_provinsi;
            }else{
                name = data.nama_kabupaten_kota;
            }
            return  {
                "id_wilayah": data.id,
                "nama_wilayah": name,
                "tahun": tahun,
                "uhh": "",
                "ahls": "",
                "arls": "",
                "ppd": "",
                "iuhh": "",
                "ipthn": "",
                "iplrn": "",
                "ipm": "",
                "prediksi_gwr": "",
            }
        })
        console.log(dataKu);

        return dataKu;
    }

    const saveFile = async (dataConvert) => {
        const ws = XLSX.utils.json_to_sheet(dataConvert);
        const wb = { Sheets: { 'data': ws}, SheetNames: ['data']};
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array'});
        const data = new Blob([excelBuffer], { type: fileType});
        FileSaver.saveAs(data, "Template Data IPM " + textTingkat  + " "+ tahun + fileExtension)
    }

    const exportToExcel = async () => {
        console.log(dataTable)

       const dataConvert = await convertData(dataTable);
       console.log("Data :", dataConvert)

       const saveProcess = await saveFile(dataConvert); 
    }
      

      const handleConvert = (event) => {
        let fileObj = event.target.files[0];
        getLast();
        
        if (fileObj) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);
            // setDataUpload(JSON.stringify(json, null, 2));
            console.log(json)
            let temp;
            if(json[0].nama_wilayah.includes("Provinsi")){
                temp = "Nasional"
                setTingkat("Nasional")
            }else{
                temp = "Provinsi"
                setTingkat("Provinsi")
            }
            console.log(temp)
            getLast(temp);
            
            setDataUpload(json)
            setFlag(false)
            setTotalUpload(0)
            setStatus(true)
          };
          reader.readAsBinaryString(fileObj);
        }
      };

    const uploadData = async (data, index) => {
        let temp = totalUpload + 1;
        let id_wilayah = parseInt(data.id_wilayah)
        let idTemp = lastData.data.data.id + index + 1;
        console.log(idTemp)
        const dataKu = new URLSearchParams({
            "idtemp": parseInt(idTemp),
            "uhh": parseFloat(data.uhh),
            "ahls": parseFloat(data.ahls),
            "arls": parseFloat(data.arls),
            "ppd": parseInt(data.ppd),
            "iuhh": parseFloat(data.iuhh),
            "ipthn": parseFloat(data.ipthn),
            "iplrn": parseFloat(data.iplrn),
            "ipm": parseFloat(data.ipm),
            "gwr": data.prediksi_gwr,
            "tahun": data.tahun
        })
        console.log(data)

        try{
            var res;
            if(tingkat === "Nasional"){
                console.log("Tambah Provinsi")
                res = await ipm_provinsiAPI.createDataIPM(id_wilayah, dataKu);
              }else{
                console.log("Tambah Kabkot")
                res = await ipm_kab_kotAPI.createDataIPM(id_wilayah, dataKu);
              }
            
            console.log(res)
            if (res.success) {
                setTotalUpload(temp);
                
            }else if(res.success === false && res.flag === true){
              alert(res.message)
            }

        }catch(error){
            alert("Data IPM " + data.nama_wilayah + "Gagal Disimpan")
        }
    }

    const SimpanData = async () => {
        setLoading(true)

        if(flag){
            alert("Data Sudah Disimpan")
            return setLoading(false)
        }

        dataUpload.map((data, index) => {
            uploadData(data, index)
            
        })
        setFlag(true)
        alert("Data Berhasil Ditambahkan ")
        setTotalUpload(0)
        setLoading(false);
    }
    const columnsIPM = ["ID Wilayah", "Nama Wilayah", "Tahun", "UHH", "AHLS", "ARLS", "PPD","IUHH","IPTHN", "IPLRN", "IPM", "GWR"]
    const stylesTable = {maxHeight: '510px', overflowY: "scroll"}
    const stylesHeaderBody = {position: "sticky", top: "-5px" }
    const stylesHeader = {textAlign: 'center', backgroundColor: '#B8D9A0'}
    const stylesNameRow = {textAlign: 'left'}


    return (
        <section>
            <Container >
                <Row>
                    <h2>Upload Data IPM</h2>
                </Row>
                {/* <Row>
                    <p>Upload data IPM melalui <b>file Excel</b> berdasarkan template yang telah disediakan</p>
                </Row> */}

                <Row className={styles.rowSection}>
                        <Col className={styles.colStyle}>
                            <Row>
                                <Col xs={6}>
                                    <p className={styles.dropdownTitle}>Pilih Tingkat</p>
                                </Col>
                                <Col >
                                    <p className={styles.dropdownTitle}>Isi Tahun</p>
                                </Col>
                                <Col xs={2}>
                                    <Button variant="light" className={styles.buttons} onClick={fetchData} disabled={loading}>
                                        {loading ? (<>
                                            <Spinner animation="border" role="status" size="sm"classNames={styles.mapSpinner}>
                                                <span className="visually-hidden">Loading...</span>
                                            </Spinner> {" "} Loading...
                                        </>):(<>Generate Template</>)}
                                    </Button>  
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={6}>                           

                                    <select name="tingkat" id="tingkat" className={styles.dropdownStyle}
                                        onChange={tingkatHandler} value={tingkat}
                                    >
                                        <option value="Nasional">Provinsi</option>
                                        <option value="Provinsi">Kabupaten/Kota</option>
                                    </select>
                                </Col>
                                <Col >
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Control
                                        size="sm"
                                        name="tahun"
                                        placeholder='20xx'
                                        onChange={(e)=> setTahun(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={2}>
                                    {
                                        found === true?
                                        (<>      
                                                <Button variant="light" className={styles.buttons} onClick={() => exportToExcel()} disabled={loading}>
                                                    Unduh Template
                                                </Button>  
                                        </>):  
                                        (<></>)
                                    }
                                </Col>
                            </Row>
                        </Col>
                </Row>
                <Row>
                    <Col xs={1}><h5>Upload</h5></Col>
                    <Col >
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Control
                                        size="sm"
                                        name="file"
                                        type="file" 
                                        onChange={(event) => handleConvert(event)}
                                        />
                                    </Form.Group>
                    </Col>
                    <Col xs={2}>
                        {status?(<>
                            <Button variant="light" className={styles.buttons}  onClick={SimpanData} disabled={loading}>
                                {loading ? (<>
                                    <Spinner animation="border" role="status" size="sm"classNames={styles.mapSpinner}>
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner> {" "} Loading...
                                </>):(<>Simpan Data</>)}
                            </Button>  
                        </>):(<></>)
                        }         
                    </Col>
                </Row>
                <Row>
                    <Col>
                    
                    {status?(<>
                            {/* <div className='sheetContainer' style={{maxHeight: 'auto'}}>
                            <div className='sheetExcel' style={{maxHeight: '500px', overflowY: "scroll"}}>
                                
                                <table >
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nama Wilayah</th>
                                            <th>Tahun</th>
                                            <th>UHH</th>
                                            <th>AHLS</th>
                                            <th>ARLS</th>
                                            <th>PPD</th>
                                            <th>IUHH</th>
                                            <th>IPTHN</th>
                                            <th>IPLRN</th>
                                            <th>IPM</th>
                                            <th>GWR</th>
                                           
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataUpload.map((item, index) => {
                                            return (
                                            <tr>
                                                <td>{item.id_wilayah}</td>
                                                <td>{item.nama_wilayah}</td>
                                                <td>{item.tahun}</td>
                                                <td>{item.uhh}</td>
                                                <td>{item.ahls}</td>
                                                <td>{item.arls}</td>
                                                <td>{item.ppd}</td>
                                                <td>{item.iuhh}</td>
                                                <td>{item.ipthn}</td>
                                                <td>{item.iplrn}</td>
                                                <td>{item.ipm}</td>
                                                <td>{item.prediksi_gwr}</td>
                                                
                                            </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            </div> */}
                            <div className="table_container" >
                                <div style={stylesTable}> 
                                <Table striped bordered hover responsive="sm" className={styles.tableStyles} >
                                    <thead style={stylesHeaderBody}>
                                        <tr style={stylesHeader}>
                                            {
                                                columnsIPM.map((column, i) =>
                                                    (<th key={i} style={stylesHeader}>{column}</th>) )
                                            }
                                        </tr>
                                    </thead>    
                                    <tbody>  
                                        {
                                            dataUpload.map((data,i) =>(
                                                <tr key={i}>
                                                    <td>{data.id_wilayah}</td>
                                                    <td style={stylesNameRow}>{data.nama_wilayah} </td>                         
                                                    <td>{data.tahun}</td>
                                                    <td>{data?.uhh}</td>
                                                    <td>{data?.ahls}</td>
                                                    <td>{data?.arls}</td>
                                                    <td>{data?.ppd}</td>  
                                                    <td>{data?.iuhh}</td>
                                                    <td>{data?.ipthn}</td>
                                                    <td>{data?.iplrn}</td>
                                                    <td>{data?.ipm}</td>
                                                    <td>{data?.prediksi_gwr}</td>
                                                </tr>
                                            ))
                                        } 
                                    </tbody>                   
                                </Table>  
                                </div>
                                <p> Menampilkan {dataUpload.length} Data</p>
                            </div>
                        </>):
                        (<>
                            <center>
                                <img
                                    src = {ImgAsset.Search_Image}
                                    width="250"
                                    height="300"
                                    alt="Search"  
                                />
                               <p className={styles.titleSection}>Silahkan Upload Data</p>
                            </center>
                        </>)
                        }
                    </Col>
                </Row>
               
                
                
            </Container>
        </section>
    );
}
