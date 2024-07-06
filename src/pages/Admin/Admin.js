import React from 'react';
import { useState, useEffect, useContext } from 'react';

import styles from './styles.module.css';
import ImgAsset from '../../assets'
import Dashboard from '../../components/fragments/Dashboard/Dashboard';
import Tabel_Wilayah from '../../components/fragments/Tabel_Wilayah/Tabel_Wilayah';
import Tabel_IPM from '../../components/fragments/Tabel_IPM/Tabel_IPM';
import Unggah_Data_IPM from '../../components/fragments/Unggah_Data_IPM';
import Data_Admin from '../../components/fragments/Data_Admin/Data_Admin';
import provinsiAPI from '../../api/provinsiAPI';
import kab_kotAPI from '../../api/kab_kotAPI';
import ipm_provinsiAPI from '../../api/ipm_provinsiAPI';
import ipm_kab_kotAPI from '../../api/ipm_kab_kotAPI';
import { UserContext } from "../../context/UserContext";

//import component Bootstrap React
import { Row, Col, ListGroup, Tab } from 'react-bootstrap'
import adminAPI from '../../api/adminAPI';

export default function Admin() {

    // const [userId, setUserId] = useState(() => {
    //     const localData = sessionStorage.getItem("id");
    //     return localData ? localData : null;
    // });
    const { user, setUser } = useContext(UserContext);

    if(user === null){
        window.location.href = "/homepage";
    }

    const [dataProvinsi, setDataProvinsi] = useState([]);
    const [dataKabKot, setDataKabKot] = useState([]);
    const [refreshStatus, setRefreshStatus] = useState(false);
    const [listYear, setListYear] = useState([]);
    const [yearFlag, setYearFlag] = useState(false);
    const [tempTingkat, setTempTingkat] = useState("Nasional");

    useEffect(() => {
        getDataWilayah(); 
        getListYear(tempTingkat);
        
    }, [])

    const getDataWilayah = async () => {
        const prov = await provinsiAPI.getAllProvinsi();
        const kabkot = await kab_kotAPI.getAllKabKot();
        setDataProvinsi(prov.data.data);
        setDataKabKot(kabkot.data.data);
    }

    // const logoutHandler = () => {
    //     if (window.confirm('Apakah Anda Yakin Ingin Logout?')) {
    //         sessionStorage.clear();
    //         alert("Anda Berhasil Logout");
    //         window.location.href = "/login";
    //     } 
    // }

    const logoutHandler = async () => {
        if (window.confirm('Apakah Anda Yakin Ingin Logout?')) {           
            
            try {
                const res = await adminAPI.logout();
                if (res.data.success) {
                    alert("Anda Berhasil Logout");
                    setUser(null);
                    sessionStorage.clear();
                    window.location.href = "/login";
                }
              } catch (error) {
                console.log(error);
              }
        }     
      };

    const navigate = (href) => {
        window.open(href, '_blank');
    }

    const getListYear = async (dataTingkat) => {
        let temp;
        if(dataTingkat === "Nasional"){
            temp = await ipm_provinsiAPI.getDataProvinsiYear();
        }else{
            temp = await ipm_kab_kotAPI.getDataKabKotYear();
        }
        setListYear(temp.data.data);
    }

    if(refreshStatus === true){
        getDataWilayah();
        setRefreshStatus(false);
    }

    if(yearFlag === true){
        getListYear(tempTingkat);
        setYearFlag(false);
    }

    return (
        <div>
        <Tab.Container className={styles.container} defaultActiveKey="#dashboard" fluid>
            <Row className={styles.rowStyle}>
                {/* Menu Navigasi */}
                <Col md="2" className={styles.colStyle}>
                    <div className={styles.menu}>
                        <center>
                            <p>
                                <a href="/homepage"><img
                                    src = {ImgAsset.GeoIPM2}
                                    width="150"
                                    height="30" 
                                    alt="GeoIPM logo"
                                /></a>                                
                            </p>
                            <p className={styles.textAdmin}> Menu Admin</p>
                            <div>
                                <ListGroup>
                                    <ListGroup.Item action href="#dashboard" className={styles.listItem}>
                                        Dashboard
                                    </ListGroup.Item>
                                    <ListGroup.Item action href="#tabel_wilayah" className={styles.listItem}>
                                        Tabel Data Wilayah
                                    </ListGroup.Item>
                                    <ListGroup.Item action href="#tabel_ipm" className={styles.listItem}>
                                        Tabel Data IPM
                                    </ListGroup.Item>
                                    <ListGroup.Item action href="#unggah_data_ipm" className={styles.listItem}>
                                        Unggah Data IPM
                                    </ListGroup.Item>
                                    <ListGroup.Item action href="#data_admin" className={styles.listItem}>
                                        Data Admin
                                    </ListGroup.Item>
                                    <ListGroup.Item action onClick={() => logoutHandler()} className={styles.logout_nav}>
                                        Logout
                                    </ListGroup.Item>
                                </ListGroup>                  
                            </div>
                            
                            <div className={styles.menuFeature}>
                                <p className={styles.textAdmin}> Menu Fitur</p>
                                <ListGroup>
                                    <ListGroup.Item action onClick={() => navigate('/homepage')} className={styles.listItem}>
                                        Homepage
                                    </ListGroup.Item>
                                    <ListGroup.Item action onClick={() => navigate('/peta_ipm')} className={styles.listItem}>
                                        Peta IPM
                                    </ListGroup.Item>
                                    <ListGroup.Item action onClick={() => navigate('/peta_gwr')} className={styles.listItem}>
                                        Peta MGWR
                                    </ListGroup.Item>

                                </ListGroup>                  
                            </div>
                        </center>
                    </div>
                </Col>


                {/* Content */}
                <Col className={styles.colStyle}>

                   <Row className={styles.rowStyle}>
                        <Tab.Content className={styles.contentStyle}>
                            <Tab.Pane eventKey="#dashboard"><Dashboard /></Tab.Pane>
                            <Tab.Pane eventKey="#tabel_wilayah"><Tabel_Wilayah listProvinsi={dataProvinsi} listKabKot={dataKabKot} refreshStatus={setRefreshStatus}/></Tab.Pane>
                            <Tab.Pane eventKey="#tabel_ipm"><Tabel_IPM listProvinsi={dataProvinsi} listKabKot={dataKabKot} listYear={listYear} yearFlag={setYearFlag} tempTingkat={setTempTingkat} refreshStatus={setRefreshStatus}/></Tab.Pane>
                            <Tab.Pane eventKey="#unggah_data_ipm"><Unggah_Data_IPM yearFlag={setYearFlag}/></Tab.Pane>
                            <Tab.Pane eventKey="#data_admin"><Data_Admin userData={user}/></Tab.Pane>
                        </Tab.Content>                      
                   </Row>
                </Col>
            </Row>   
             
        </Tab.Container>
        </div>
    );
}
