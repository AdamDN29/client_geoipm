import React from 'react'
import { useState, useEffect } from "react";
import ImgAsset from '../../../assets'
import styles from './styles.module.css';

//import component Bootstrap React
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap'
import { Link } from "react-router-dom";

export default function Navbars () {
    const [userId, setUserId] = useState(() => {
        const localData = sessionStorage.getItem("id");
        return localData ? localData : null;
    });
    
	const loginAdmin = () => {
        if (userId !== null){
            // window.location.href = "/admin";
            window.open("/admin");
        }else{
            // window.location.href = "/login";
            window.open("/login");
        }     
    }
    return (
        <section>
            <Navbar collapseOnSelect expand="lg" bg="light" variant="light" fixed="top" className={styles.navbarStyle}>
                {/* Logo */}
                <Navbar.Brand href="/homepage">
                    <img
                        src = {ImgAsset.GeoIPM}
                        // width="150"
                        // height="30"
                        className={`d-inline-block align-center ${styles.navbar_brand}`}
                        alt="GeoIPM logo"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                {/* Menu Navigation */}
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        {/* Menu IPM Maps */}      
                        <Nav.Link as={Link} to="/peta_ipm" className={`nav-link ${styles.nav_icon_field}`}>
                            <img
                                src = {ImgAsset.Icon_IPM_Maps}
                                width="25"
                                height="25"
                                className={`d-inline-block ${styles.nav_icon_img}`}
                                alt="Icon Peta IPM"
                            />
                            <span className={styles.nav_icon_text}>Peta IPM</span>
                        </Nav.Link>  

                        {/* <div  className={`${styles.nav_icon_field}`}>
                            <img
                                src = {ImgAsset.Icon_IPM_Maps}
                                width="25"
                                height="25"
                                className={`d-inline-block ${styles.nav_icon_img}`}
                                alt="Icon Peta IPM"
                            />
                            <NavDropdown title="Peta IPM"  className={`${styles.nav_icon_text}`}>
                                <NavDropdown.Item href="/peta_ipm/nasional">
                                    Tingkat Nasional
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Tingkat Provinsi</NavDropdown.Item>
                            </NavDropdown>
                        </div> */}
                        {/* Menu GWR Maps */}
                        <Nav.Link as={Link} to="/peta_gwr" className={`nav-link ${styles.nav_icon_field}`}>
                            <img
                                src = {ImgAsset.Icon_GWR_Maps}
                                width="25"
                                height="25"
                                className={`d-inline-block ${styles.nav_icon_img}`}
                                alt="Icon Updates"
                            />
                            <span className={styles.nav_icon_text}>Peta GWR</span>
                        </Nav.Link>
                        {/* Menu Table Data */}
                        <Nav.Link as={Link} to="/tabel_data" className={`nav-link ${styles.nav_icon_field}`}>
                            <img
                                src = {ImgAsset.Icon_Table_Data}
                                width="25"
                                height="25"
                                lassName={`d-inline-block ${styles.nav_icon_img}`}
                                alt="Icon Updates"
                            />
                            <span className={styles.nav_icon_text}>Tabel Data</span>
                        </Nav.Link>                
                        
                    </Nav>
                    <Nav className='ml-auto'>
                        <Button
                                variant="light"
                                className={styles.buttons}
                                onClick={(loginAdmin)}
                            >
                            {userId !== null? <>Dashboard</>:<>Login Admin</>}
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </section>
    )
}