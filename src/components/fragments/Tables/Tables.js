import React, { useEffect, useState, useMemo } from "react";
import styles from "./styles.module.css";
import { Table} from "react-bootstrap";
import separatorNumber from "../../../hook/separatorNumber";

import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ipm_provinsiAPI from "../../../api/ipm_provinsiAPI";
import ipm_kab_kotAPI from "../../../api/ipm_kab_kotAPI";
import provinsiAPI from "../../../api/provinsiAPI";
import kab_kotAPI from "../../../api/kab_kotAPI";

export default function Tables({contentChanger, dataChanger, tableFlag, textTingkat, dataTable, actionFlag, refreshFlag}) {
    
    useEffect (() => {
        console.log(dataTable)
    },[])

    function EditData (value) {
        console.log(value)  
        dataChanger(value)
        contentChanger("edit")
    }

    const DeleteData = async (value) => {
        console.log(value)
        if (window.confirm('Apakah Anda Yakin Ingin Menghapus Data?')) {
            fetchDeleteData(value);
        }       
    }

    const fetchDeleteData = async(value) => {
        var res;
        try{ 
            if (tableFlag === "showIPM"){
                if(textTingkat === "Provinsi"){
                    res = await ipm_provinsiAPI.deleteDataIPM(parseInt(value));
                }else{
                    res = await ipm_kab_kotAPI.deleteDataIPM(parseInt(value));
                }    
            }else{
                if(textTingkat === "Provinsi"){
                    res = await provinsiAPI.deleteDataWilayah(parseInt(value));
                }else{
                    res = await kab_kotAPI.deleteDataWilayah(parseInt(value));
                }    
            }  
            console.log(res)
            if (res.data.success === true) {
                alert("Data Berhasil Dihapus!")
                refreshFlag(true)
            }else if(res.data.success === false && res.data.flag === true){
              alert(res.message)
            }
        }catch(error){
            alert("Data Gagal Dihapus")
        }
    }  

    const columnsIPM = ["Nama Wilayah", "Tahun", "UHH", "AHLS", "ARLS", "PPD","IUHH","IPTHN", "IPLRN", "IPM", "Model MGWR"]
    const columnsWilayah = ["ID", "Nama Wilayah", "Latitude", "Longitude"]

    const stylesTable = {maxHeight: '510px', overflowY: "scroll"}
    const stylesHeaderBody = {position: "sticky", top: "-5px" }
    const stylesHeader = {textAlign: 'center', backgroundColor: '#B8D9A0'}
    const stylesNameRow = {textAlign: 'left'}

    return (
        <>
            {tableFlag === "showIPM" ? (
                // Tampil Data IPM
                <div className="table_container" >
                    <div style={stylesTable}> 
                    <Table striped bordered hover responsive="sm" className={styles.tableStyles} >
                        <thead style={stylesHeaderBody}>
                            <tr style={stylesHeader}>
                                
                                {
                                    actionFlag ? (<th style={stylesHeader}>ID</th>):(<><th style={stylesHeader}>No</th></>)
                                }
                                {
                                    columnsIPM.map((column, i) =>
                                        (<th key={i} style={stylesHeader}>{column}</th>) )
                                }
                                {
                                    actionFlag ? (<th style={stylesHeader} colSpan={2}>Action</th>):(<></>)
                                }
                            </tr>
                        </thead>    
                        <tbody>  
                            {
                                dataTable.map((data,i) =>(
                                    <tr key={i}>
                                        
                                        {actionFlag ? (<td>{data.id}</td>):(<><td>{i+1}</td></>)}
                                        <td style={stylesNameRow}>{data.Wilayah.nama_wilayah} </td>                         
                                        <td>{data.tahun}</td>
                                        <td>{data?.uhh.toFixed(2)}</td>
                                        <td>{data?.ahls.toFixed(2)}</td>
                                        <td>{data?.arls.toFixed(2)}</td>
                                        <td>Rp. {separatorNumber(data?.ppd * 1000)}</td>  
                                        <td>{data?.iuhh.toFixed(3)}</td>
                                        <td>{data?.ipthn.toFixed(3)}</td>
                                        <td>{data?.iplrn.toFixed(3)}</td>
                                        <td>{data?.ipm.toFixed(2)}</td>
                                        <td>{data?.mgwr}</td>
                                        {
                                            actionFlag ? (
                                            <>
                                                <td>
                                                    <button className={styles.buttons} onClick={() => EditData(data.id)} >
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                </td>
                                                <td>
                                                    <button className={styles.buttons} onClick={() => DeleteData(data.id)} >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </td>
                                            </>):(<></>)
                                        }
                                    </tr>
                                ))
                            } 
                        </tbody>                   
                    </Table>  
                    </div>
                    <p> Menampilkan {dataTable.length} Baris</p>
                </div>          
            ):(
                // Tampil Data Wilayah
                <div className="table_container" >
                    <div style={stylesTable}> 
                    <Table striped bordered hover responsive="sm" className={styles.tableStyles} >
                        <thead style={stylesHeaderBody}>
                            <tr style={stylesHeader}>
                                
                                {
                                    columnsWilayah.map((column, i) =>
                                        (<th key={i} style={stylesHeader}>{column}</th>) )
                                }
                                {
                                    actionFlag ? (<th style={stylesHeader} colSpan={2}>Action</th>):(<></>)
                                }
                            </tr>
                        </thead>    
                        <tbody>  
                            {
                                dataTable.map((data,i) =>(
                                    <tr key={i}>
                                        
                                        {actionFlag ? (<td>{data.id}</td>):(<></>)}
                                        <td style={stylesNameRow}>{data?.nama_wilayah} </td>                         
                                        <td>{data?.latitude.toFixed(7)}</td>
                                        <td>{data?.longitude.toFixed(7)}</td>
                                        {
                                            actionFlag ? (
                                            <>
                                                <td>
                                                    <button className={styles.buttons} onClick={() => EditData(data.id)} >
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                </td>
                                                <td>
                                                    <button className={styles.buttons} onClick={() => DeleteData(data.id)} >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </td>
                                            </>):(<></>)
                                        }
                                    </tr>
                                ))
                            } 
                        </tbody>                   
                    </Table>  
                    </div>
                    <p> Menampilkan {dataTable.length} Baris</p>
                </div>
            )}
        </>
    );
}