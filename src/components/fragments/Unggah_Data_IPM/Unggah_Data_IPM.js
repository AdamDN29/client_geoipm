import React, { useState } from 'react';

import styles from './styles.module.css'
import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';
import provinsiAPI from '../../../api/provinsiAPI';
import kab_kotAPI from '../../../api/kab_kotAPI';
import ipm_provinsiAPI from "../../../api/ipm_provinsiAPI";
import ipm_kab_kotAPI from "../../../api/ipm_kab_kotAPI";
import ImgAsset from '../../../assets';
import preventMinus from '../../../hook/preventMinus';


//import component Bootstrap React
import { Container, Row, Col, Form, Button, Spinner, Table } from 'react-bootstrap'

export default function Unggah_Data_IPM({yearFlag}) {

    const [tingkat, setTingkat] = useState("Provinsi");
    const [tahun, setTahun] = useState("");
    const [loading, setLoading] = useState(false);
    const [found, setFound] = useState(false);
    const [status, setStatus] = useState(false);
    const [flag, setFlag] = useState(false);
    
    const [textTingkat, setTexTingkat] = useState("Provinsi");

    const [lastData, setLastData] = useState();
    const [dataTable, setDataTable] = useState([]);
    const [dataUpload, setDataUpload] = useState([]);


    const getLast = async (temp) => {
        let res;
        console.log(temp)
        if(temp === "Provinsi"){
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
        if(tahun === "" || tahun < 2000 || tahun > 2099){
            alert("Silahkan Isi Tahun dengan benar")
            return setLoading(false);
        }

        if(tingkat === "Provinsi"){
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
        if (e.target.value === "Provinsi"){
            setTexTingkat("Provinsi")
        }else{setTexTingkat("Kabupaten/Kota")}
        setTingkat(e.target.value)             
    }

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const convertData = async (dataTable) => {
        const dataKu = dataTable.map((data,i) => {
            return  {
                "id_wilayah": data.id,
                "nama_wilayah": data.nama_wilayah,
                "tahun": tahun,
                "uhh": "",
                "ahls": "",
                "arls": "",
                "ppd": "",
                "iuhh": "",
                "ipthn": "",
                "iplrn": "",
                "ipm": "",
                "model_mgwr": "",
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
            try{
                if(json[0].nama_wilayah.includes("Provinsi")){
                    temp = "Provinsi"
                    setTingkat("Provinsi")
                }else {
                    temp = "Kabupaten/Kota"
                    setTingkat("Kabupaten/Kota")
                }
                console.log(temp)
                getLast(temp);
                
                setDataUpload(json)
                setFlag(false)
                setStatus(true)
            }catch{
                alert("File tidak sesuai template!")
            }
           
          };
          reader.readAsBinaryString(fileObj);
        }
      };

    

    const uploadData = async (data, index) => {
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
            "mgwr": data.model_mgwr,
            "tahun": data.tahun
        })
        console.log(data)

        try{
            let res;
            if(tingkat === "Provinsi"){
                console.log("Tambah Provinsi")
                res = await ipm_provinsiAPI.createDataIPM(id_wilayah, dataKu);
            }else{
                console.log("Tambah Kabkot")
                res = await ipm_kab_kotAPI.createDataIPM(id_wilayah, dataKu);
            }
            
            if (res.success === true) {
                console.log("Success")
                return 1;
                
            }else if(res.success === false && res.flag === true){
              alert("Data IPM ke-" + data.id_wilayah + " Gagal Disimpan \n" + res.message)
              return 0;
            }

        }catch(error){
            alert("Data IPM " + data.nama_wilayah + " Gagal Disimpan \n" + error.message)
            return 0;
        }
    }

    const SimpanData = async () => {
        setLoading(true)
        if(flag){
            alert("Data Sudah Disimpan")
            return setLoading(false)
        }

        let temp = dataUpload.map(async (data, index) => {
            let count = await uploadData(data, index);
            return count;
        }) 

        const results = await Promise.all(temp);      
        const countTotal = results.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        console.log(results)      
        
        alert("Data Berhasil Ditambahkan : " + countTotal + " dari " + dataUpload.length) 
        setFlag(true)
        setLoading(false); 
        yearFlag(true);
    }

    const columnsIPM = ["ID", "Nama Wilayah", "Tahun", "UHH", "AHLS", "ARLS", "PPD","IUHH","IPTHN", "IPLRN", "IPM", "Model MGWR"]
    const stylesTable = {maxHeight: '29.5rem', overflowY: "scroll"}
    const stylesHeaderBody = {position: "sticky", top: "-5px" }
    const stylesHeader = {textAlign: 'center', backgroundColor: '#B8D9A0'}
    const stylesNameRow = {textAlign: 'left'}

    return (
        <section>
            <Container >
                <Row>
                    <h2>Unggah Data IPM</h2>
                </Row>

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
                                        <option value="Provinsi">Provinsi</option>
                                        <option value="Kabupaten/Kota">Kabupaten/Kota</option>
                                    </select>
                                </Col>
                                <Col >
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Control
                                        size="sm"
                                        name="tahun"
                                        type="number"
                                        min="2000"
                                        max="2050"
                                        onKeyPress={preventMinus}
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
                    <Col xs={1}><h5>Unggah</h5></Col>
                    <Col >
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Control
                                        size="sm"
                                        name="file"
                                        type="file" 
                                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
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
                                                    <td>{data?.model_mgwr}</td>
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
                               <p className={styles.titleSection}>Silahkan Unggah Data</p>
                            </center>
                        </>)
                        }
                    </Col>
                </Row>           
            </Container>
        </section>
    );
}
