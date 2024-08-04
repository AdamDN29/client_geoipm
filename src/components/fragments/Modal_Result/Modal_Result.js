import React from 'react';
import {useState} from 'react'
import Modal from 'react-bootstrap/Modal';
import {Row, Col, Table} from 'react-bootstrap';
import styles from './styles.module.css';
import separatorNumber from '../../../hook/separatorNumber';

export default function Modal_Result(props) {
    const { max, min, gwrflag, data, tingkat, tahun, textDataType, dataType } = props;
    const [wilayah, setWilayah] = useState(0)
    const [input1, setInput1] = useState(0)
    const [input2, setInput2] = useState(0)
    const [input3, setInput3] = useState(0)
    const resultValue = (data[wilayah].intercept + (data[wilayah].iuhh * input1) + (data[wilayah].ipthn * input2) + (data[wilayah].iplrn * input3)).toFixed(3)

    let roundedMax, roundedMin, nfixed = 0;

    if(gwrflag){
        roundedMax = max.toFixed(5);
        roundedMin = min.toFixed(5);
    }else{
        roundedMax = max.toFixed(3);
        roundedMin = min.toFixed(3);
    }

    let text1 = "";
    let text2 = "";
  
    if(dataType === "PPD"){
      text1 = " Rp. "
      roundedMax = separatorNumber(roundedMax*1000);
      roundedMin = separatorNumber(roundedMin*1000);
    }
    else if(dataType === "UHH" || dataType === "AHLS" || dataType === "ARLS"){text1 = ""; text2= " Tahun "; nfixed = 2;}
    else if(dataType === "IPM"){nfixed = 2}
    else{nfixed = 3}

    let kel1 = [];
    let kel2 = [];
    let kel3 = [];

    data.sort( (a,b) => b.value - a.value );

    data.forEach(element => {
        if(element.value > max){
            kel1.push(element)
        }
        else if(element.value < min){
            kel3.push(element);
        }
        else{
            kel2.push(element);
        }
    });

    // kel1.sort( (a,b) => b.value - a.value );
    // kel2.sort( (a,b) => b.value - a.value );
    // kel3.sort( (a,b) => b.value - a.value );

    let percenKel1 = ((kel1.length / data.length)*100).toFixed(2);
    let percenKel2 = ((kel2.length / data.length)*100).toFixed(2);
    let percenKel3 = ((kel3.length / data.length)*100).toFixed(2);

    // const showprediksiData = (nama_wilayah, value, ipmvalue, index) => {
    //     return(
    //         <>
    //         <p className={styles.list}>
    //             {index}. {nama_wilayah} <br></br>&nbsp;&nbsp;
    //             {"  - "}IPM {tahun}: {value} {text2} <br></br>&nbsp;&nbsp;
    //             {"  - "}IPM {tahun-1}: {ipmvalue} {text2} <br></br>&nbsp;&nbsp;
    //             {"  - "}Selisih : {(value-ipmvalue).toFixed(3)} <br></br>
    //         </p>   
    //         </>
    //     )
    // }

    const formatValue = (value) => {
        if(dataType === "PPD"){
            return separatorNumber(value*1000);
        }else{return value.toFixed(nfixed)}
    }

    const stylesTable = {maxHeight: '380px', overflowY: "scroll"}
    const stylesHeaderBody = {position: "sticky", top: "-5px" }
    const stylesHeader = {textAlign: 'center', backgroundColor: '#B8D9A0'}
    const stylesNameRow = {textAlign: 'left'}

    return (
        <Modal
        {...props}
        size="lg"
        dialogClassName={styles.modal}
        aria-labelledby="contained-modal-title-vcenter"
        centered 
        >
        <Modal.Header className={styles.header} closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
            Hasil
            </Modal.Title>
        </Modal.Header>
            <Modal.Body className={styles.header}>
                <p className={styles.dataTitle}><b>Data {gwrflag ? (<>Estimasi Parameter Model MGWR</>):<>{textDataType}</>} Tingkat {tingkat === "Provinsi" ? (<>Provinsi</>):(<>Kabupaten/Kota</>)} Tahun {tahun}</b></p>
                <p><Row classNames={styles.row1} >
                    <Col>Total Data : {data.length} </Col>
                    <Col>Nilai Batas Atas  : {text1}{roundedMax}{text2}</Col>
                    <Col>Nilai Batas Bawah  : {text1}{roundedMin}{text2}</Col>
                   
                </Row>
                    {
                        gwrflag?(<Row><div>Model MGWR = Intercept + (Est IUHH * IUHH) + (Est IPTHN * IPTHN) + (Est IPLRN * IPLRN) = IPM Prediksi</div></Row>):(<></>)
                    }  
                </p>
                {/* <p>Total Data : {data.length} </p>
                <p>Nilai Max  : {roundedMax}</p>
                <p>Nilai Min  : {roundedMin}</p> */}
                {
                    !gwrflag? (<>
                        <Row classNames={styles.row1}>
                            <Col>
                                <Row><p className={styles.kel1}><b> Kelompok 1 (Tinggi)</b></p></Row>
                                <div className={styles.listField}>
                                    {
                                        kel1.map((data, i) => {
                                            let value = formatValue(data.value);
            
                                            // if(dataType === "PPD"){
                                            //     value = separatorNumber(data.value*1000);
                                            // }else{value = value.toFixed(nfixed)}

                                            return(
                                                <><p className={styles.list}>{i+1}. {data.Wilayah.nama_wilayah} ({text1} {value} {text2})</p></>            
                                            )
                                        })
                                    }
                                </div>
                                <Row><p className={styles.totalList}>{dataType} <span>{`> ${text1}${roundedMax}` || '...'}{text2}</span> </p></Row>
                                <Row><p className={styles.totalList}>Total : {kel1.length} ({percenKel1}%)</p></Row>   
                            </Col>
                            <Col>
                                <Row><p className={styles.kel2}><b> Kelompok 2 (Sedang)</b></p></Row>
                                <div className={styles.listField}>
                                    {
                                        kel2.map((data, i) => {
                                            let value = formatValue(data.value);
                                            let rowIndex = kel1.length + i;
                                            return(
                                                <><p className={styles.list}>{rowIndex+1}. {data.Wilayah.nama_wilayah} ({text1} {value} {text2})</p></>   
                                            )
                                        })
                                    }
                                </div>    
                                <Row><p className={styles.totalList}><span>{text1}{roundedMin || '...'} ≤ {dataType} ≤ {text1}{roundedMax || '...'}{text2}</span> </p></Row>
                                <Row><p className={styles.totalList}>Total : {kel2.length} ({percenKel2}%)</p></Row>   
                            </Col>
                            <Col>
                                <Row><p className={styles.kel3}><b> Kelompok 3 (Rendah)</b></p></Row>
                                <div className={styles.listField}>
                                    {
                                        kel3.map((data, i) => {
                                            let value = formatValue(data.value);
                                            let rowIndex = kel1.length + kel2.length + i;
                                            return(
                                                <><p className={styles.list}>{rowIndex+1}. {data.Wilayah.nama_wilayah} ({text1} {value} {text2})</p></>   
                                            )
                                        })
                                    }
                                </div>
                                <Row><p className={styles.totalList}>{dataType} <span>{`< ${text1}${roundedMin}` || '...'}{text2}</span> </p></Row>
                                <Row><p className={styles.totalList}>Total : {kel3.length} ({percenKel3}%)</p></Row>   
                            </Col>
                        </Row>
                    </>):(<>
                        <Row classNames={styles.row1}>
                            <div style={stylesTable}>
                            <Table striped bordered hover responsive="sm" className={styles.tableStyles} >
                                <thead style={stylesHeaderBody}>
                                    <tr style={stylesHeader}>
                                        <th style={stylesHeader}>No</th>
                                        <th style={stylesHeader}>Nama Wilayah</th>
                                        {/* <th style={stylesHeader}>Model MGWR</th> */}
                                        <th style={stylesHeader}>Intercept</th>
                                        <th style={stylesHeader}>Est IUHH</th>
                                        <th style={stylesHeader}>IUHH</th>
                                        <th style={stylesHeader}>Est IPTHN</th>
                                        <th style={stylesHeader}>IPTHN</th>
                                        <th style={stylesHeader}>Est IPLRN</th>
                                        <th style={stylesHeader}>IPLRN</th>
                                        <th style={stylesHeader}>IPM Prediksi</th>
                                        <th style={stylesHeader}>IPM</th>
                                        {/* <th style={stylesHeader} >Selisih</th> */}
                                    </tr>
                                </thead>    
                                <tbody>  
                                    {
                                        data.map((data,i) =>{
                                            
                                            return(
                                            <tr key={i}>
                                                <td>{i+1}</td>
                                                <td style={stylesNameRow}>{data.Wilayah.nama_wilayah} </td>      
                                                {/* <td>{data?.intercept.toFixed(5) + "+(" + data?.iuhh.toFixed(5) + "*IUHH)+(" + data?.ipthn.toFixed(5) + "*IPTHN)+(" + data?.iplrn.toFixed(5) + "*IPLRN)"}</td>                   */}
                                                <td>{data?.intercept.toFixed(5)}</td>
                                                <td>{data?.iuhh.toFixed(5)}</td>
                                                <td>{data?.iuhh_r.toFixed(3)}</td>
                                                <td>{data?.ipthn.toFixed(5)}</td>
                                                <td>{data?.ipthn_r.toFixed(3)}</td>
                                                <td>{data?.iplrn.toFixed(5)}</td>
                                                <td>{data?.iplrn_r.toFixed(3)}</td>
                                                <td>{(data.intercept + (data.iuhh * data.iuhh_r) + (data.ipthn* data.ipthn_r) + (data.iplrn * data.iplrn_r)).toFixed(3)}</td>
                                                <td>{data?.ipm.toFixed(2)}</td>
                                                {/* <td>{((data.intercept + (data.iuhh * data.iuhh_r) + (data.ipthn* data.ipthn_r) + (data.iplrn * data.iplrn_r)) - data.ipm).toFixed(5)}</td> */}
                                                
                                            </tr>
                                        )})
                                    } 
                                </tbody>                   
                            </Table>  
                            </div>
                        </Row>
                        {/* <Row>
                            <p>Perhitungan IPM Prediksi berdasarkan model MGWR <br/>
                            IPM Prediksi = Intercept + (Estimasi IUHH * IUHH) + (Estimasi IPTHN * IPTHN) + (Estimasi IPLRN * IPLRN)
                            </p>   
                        </Row> */}
                        <Row>
                            <b>Hitung IPM berdasarkan model MGWR</b>
                            <div>
                            <Table>
                                <tbody>
                                    <tr>
                                        <td>Wilayah</td>
                                        <td>=</td>
                                        <td>Intercept</td><td>+</td>
                                        <td>Est IUHH</td><td>*</td>
                                        <td>IUHH</td><td>+</td>
                                        <td>Est IPTHN</td><td>*</td>
                                        <td>IPTHN</td><td>+</td>
                                        <td>Est IPLRN</td><td>*</td>
                                        <td>IPLRN</td><td>=</td>
                                        <td>IPM Prediksi</td>
                                    </tr>
                                    <tr>
                                        <td>
                                        <select name="wilayah" id="wilayah" className={styles.dropdownStyle}
                                            onChange={(e) => setWilayah(e.target.value)} value={wilayah}>  
                                            {data.map((data,i) => {
                                                    return(<option key={i} value={i}>{data.Wilayah.nama_wilayah}</option>)
                                            })}     
                                            </select>
                                        </td>
                                        <td>=</td>
                                        <td><input type="number" name='est_intercept' value={data[wilayah].intercept}  style={{width: "100%"}} disabled/></td><td>+</td>
                                        <td><input type="number" name='est_iuhh'  value={data[wilayah].iuhh} style={{width: "100%"}} disabled/></td><td>*</td>
                                        <td><input type="number" name='p_iuhh' placeholder='IUHH' min="0" max="1"  value={input1} onChange={(e) => setInput1(e.target.value)}/></td><td>+</td>
                                        <td><input type="number" name='est_ipthn'  value={data[wilayah].ipthn} style={{width: "100%"}} disabled/></td><td>*</td>
                                        <td><input type="number" name='p_ipthn' placeholder='IPTHN' min="0" max="1" value={input2} onChange={(e) => setInput2(e.target.value)}/></td><td>+</td>
                                        <td><input type="number" name='est_iplrn'  value={data[wilayah].iplrn} style={{width: "100%"}} disabled/></td><td>*</td>
                                        <td><input type="number" name='p_iplrn' placeholder='IPLRN' min="0" max="1" value={input3} onChange={(e) => setInput3(e.target.value)}/></td><td>=</td>
                                        <td><input type="number" name='result'  value={resultValue} disabled/></td>
                                    </tr>
                                </tbody>
                            </Table>
                            </div>
                        </Row>
                    </>)
                }             
            </Modal.Body>
   
        {/* <Modal.Footer >    
        </Modal.Footer> */}
        </Modal>
    );
}