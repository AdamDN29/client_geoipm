import React from 'react';
import { useState, useEffect } from 'react';

import styles from './styles.module.css';
import ImgAsset from '../../assets'
import Dashboard from '../../components/fragments/Dashboard/Dashboard';
import Tabel_Wilayah from '../../components/fragments/Tabel_Wilayah/Tabel_Wilayah';
import Tabel_IPM from '../../components/fragments/Tabel_IPM/Tabel_IPM';
import Upload_Data_IPM from '../../components/fragments/Upload_Data_IPM';
import Data_Admin from '../../components/fragments/Data_Admin/Data_Admin';


//import component Bootstrap React
import { Container, Row, Col, Button, Spinner, ListGroup, Tab, NavDropdown } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';

export default function Admin() {

    const [userId, setUserId] = useState(() => {
        const localData = sessionStorage.getItem("id");
        return localData ? localData : null;
    });

    if(userId === null){
        window.location.href = "/homepage";
    }

    const logoutHandler = () => {
        if (window.confirm('Apakah Anda Yakin Ingin Logout?')) {
            sessionStorage.clear();
            alert("Anda Berhasil Logout");
            window.location.href = "/homepage";
        } 
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
                                    <ListGroup.Item action href="#upload_data_ipm" className={styles.listItem}>
                                        Upload Data IPM
                                    </ListGroup.Item>
                                    <ListGroup.Item action href="#data_admin" className={styles.listItem}>
                                        Data Admin
                                    </ListGroup.Item>
                                    <ListGroup.Item action onClick={() => logoutHandler()} className={styles.logout_nav}>
                                        Logout
                                    </ListGroup.Item>
                                </ListGroup>                  
                            </div>
                        </center>
                    </div>
                </Col>

                {/* Content */}
                <Col className={styles.colStyle}>
                   {/* <Row className={styles.rowStyle}>
                        <div className={styles.avatarField}>
                            <NavDropdown className={styles.avatarDropdown}
                                title={
                                    <FontAwesomeIcon icon={faCircleUser} style={{color: "#2a2e2e",}} className={styles.avatar}/>
                                }
                                >
                                

                                <NavDropdown.Item onClick={logoutHandler} className={styles.logout_nav}>Log Out</NavDropdown.Item>
                            </NavDropdown>
                        </div>
                   </Row> */}
                   <Row className={styles.rowStyle}>
                        <Tab.Content className={styles.contentStyle}>
                            <Tab.Pane eventKey="#dashboard"><Dashboard /></Tab.Pane>
                            <Tab.Pane eventKey="#tabel_wilayah"><Tabel_Wilayah /></Tab.Pane>
                            <Tab.Pane eventKey="#tabel_ipm"><Tabel_IPM /></Tab.Pane>
                            <Tab.Pane eventKey="#upload_data_ipm"><Upload_Data_IPM /></Tab.Pane>
                            <Tab.Pane eventKey="#data_admin"><Data_Admin userId={userId}/></Tab.Pane>
                        </Tab.Content>                      
                   </Row>
                </Col>
            </Row>    
        </Tab.Container>
        </div>
    );
}
