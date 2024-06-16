import React from 'react'
import { useState, useEffect } from "react";
import ImgAsset from '../../../assets'
import styles from './styles.module.css';

//import component Bootstrap React
import { Navbar, Nav, NavDropdown, Button, Container, Card, Col, Row } from 'react-bootstrap'
import { Link } from "react-router-dom";

export default function Footers () {
	
    return (
        <section>
            <footer sticky="bottom" className={styles.footerStyle}>
                <Container className="mt-3">
                    <Row>
                        {/* Menu Navigation */}
                        <Col>
                            <Row>
                                <Col md="4">
                                    <Row><a href="/peta_ipm"><p href="/peta_ipm" className={styles.link_text}>Peta IPM</p></a></Row>
                                    <Row><a href="/peta_gwr"><p className={styles.link_text}>Peta GWR</p></a></Row>
                                </Col>
                                <Col>
                                        <Row><a href="/tabel_data"><p className={styles.link_text}>Tabel Data</p></a></Row>
                                        <Row><a href="/tentang"><p className={styles.link_text}>Tentang</p></a></Row>
                                </Col>
                            </Row>                
                        </Col>
                        {/* Logo & Copyright */}
                        <Col>
                            <Row>
                                <img
                                    src = {ImgAsset.GeoIPM2}
                                    width="25"
                                    height="25"
                                    className={`d-inline-block ${styles.ipm_image}`}
                                    alt="Foto GWR"
                                />
                            </Row>
                            <Row><p className={styles.copyright}> © 2024 | All Rights Reserved</p></Row>
                        </Col>
                        <Col>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </section>
    )
}