import React, {useState, useEffect, useReducer, useRef} from 'react';

import styles from "./styles.module.css";
import adminAPI from '../../../api/adminAPI';

//import component Bootstrap React
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap'

const initialStateProfile = {
    email: "",
    username: "",
    nama: "",
    password: "",
}

const initialStatePassword = {
    password: "",
    newpassword: "",
    confirmpassword: "",
}

const profileReducer = (currentState, action) => {
    switch (action.type) {
        case "email":
            return { ...currentState, email: action.payload };
        case "username":
            return { ...currentState, username: action.payload };
        case "nama":
            return { ...currentState, nama: action.payload };
        default:
            return currentState;
    }
}

const passwordReducer = (currentState, action) => {
    switch (action.type) {
        case "password":
            return { ...currentState, password: action.payload };
        case "newpassword":
            return { ...currentState, newpassword: action.payload };
        case "confirmpassword":
            return { ...currentState, confirmpassword: action.payload };
        default:
            return currentState;
    }
}

export default function Data_Admin({userId}) {
    console.log(userId)
    
    const [preload, setPreLoad] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const ref1 = useRef("");
    const ref2 = useRef("");
    const ref3 = useRef("");

    const [user, dispatch1] = useReducer(profileReducer, initialStateProfile);
    const [pass, dispatch2] = useReducer(passwordReducer, initialStatePassword);

    useEffect(() => {
        getDataAdmin(userId);
    },[])


    const getDataAdmin = async (id) => {
        const res = await adminAPI.getDataAdmin(id);
        setPreLoad(res.data.data)
    }

    const submitProfile = async (e) => {        
		e.preventDefault();
        setIsLoading(true);
        console.log(user);

        // const formData = new FormData();
		// formData.append("id", preload.id);

		// if (user.username !== ""){
		// 	formData.append("username", user.username);
		// }
		// if (user.nama !== ""){
		// 	formData.append("nama", user.nama);
		// }

        let username, nama;

        if (user.username !== ""){
			username = user.username;
		}else{username = preload.username}
		if (user.nama !== ""){
			nama = user.nama;
		}else{nama = preload.nama}

        const data = new URLSearchParams({
            "id": preload.id,
            "username": username,
            "nama": nama
        })

        try{
            const res = await adminAPI.editDataAdmin(preload.id, data);
            console.log(res)
            if (res.success) {  
                alert("Data Profile Berhasil di Simpan")
              }
        }catch(error){
            alert("Data Profile Gagal di Simpan")
        }	
        setIsLoading(false);
	};

    const submitPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        console.log(user);

        if (pass.password === "" || pass.newPassword === "" || pass.confirmpassword === ""){
            alert("Silahkan Lengkapi Form Password!")
            
        }
        else{
            if(pass.password === preload.password){
                if(pass.newpassword === pass.confirmpassword){

                    const data = new URLSearchParams({
                        "id": preload.id,
                        "password": pass.newpassword
                    })
                    console.log(data)

                    try{
                        const res = await adminAPI.editPassAdmin(preload.id, data);
                        console.log(res)
                        if (res.success) {
                            setIsLoading(false);
                            alert("Password Baru Berhasil di Simpan")
                            ref1.current.value = '';
                            ref2.current.value = '';
                            ref3.current.value = '';
                        }
                    }catch(error){
                        alert("Password Baru Gagal di Simpan")
                        ref1.current.value = '';
                        ref2.current.value = '';
                        ref3.current.value = '';
                    }
                }else{
                    alert("Password Baru dan Kofirmasi Password Harus Sama!")
                }           
            }else{
                alert("Password Lama Tidak Sesuai!")
            }
        }
        setIsLoading(false);   
    }

    return (
        <section>
            <Container >
                <Row>
                    <h2>Data Admin</h2>
                </Row>
                <Row>
                    <Col className={styles.colStyle}>
                        <p className={styles.titleSection}>Ubah Profile</p>
                        <Form className={styles.formEdit} onSubmit={submitProfile}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label className="label_form">Email</Form.Label>
                                    <Form.Control 
                                        size="sm"
                                        type="text" 
                                        name='email'
                                        defaultValue ={preload.email}
                                        disabled 
                                        onBlur={(e) =>
                                            dispatch1({ type: "email", payload: e.target.value })
                                        }
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label className="label_form">Username</Form.Label>
                                    <Form.Control 
                                        size="sm"
                                        type="text" 
                                        name='username'
                                        defaultValue ={preload.username}
                                        onBlur={(e) =>
                                            dispatch1({ type: "username", payload: e.target.value })
                                        }
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label className="label_form">Nama</Form.Label>
                                    <Form.Control 
                                        size="sm"
                                        type="text" 
                                        name='nama'
                                        defaultValue ={preload.nama}
                                        onBlur={(e) =>
                                            dispatch1({ type: "nama", payload: e.target.value })
                                        }
                                />
                            </Form.Group>                      
                                        
                            <Row className="btn_group">
                                <Col>                
                                    <Button variant="light" disabled={isLoading} className={styles.buttons} type="submit" onClick={submitProfile}>
                                        {
                                            isLoading === false ? (<>Ubah Profile</>)
                                            :(<>
                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"
                                                />{" "} Loading... </>)
                                        }
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                    {/* Form Password */}
                    <Col>
                        <p className={styles.titleSection}>Ubah Password</p>
                        <Form className={styles.formEdit} onSubmit={submitPassword} >
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label className="label_form">Password Lama</Form.Label>
                                    <Form.Control 
                                        ref={ref1}
                                        size="sm"
                                        type="password" 
                                        placeholder="*********************"
                                        name='password'
                                        onBlur={(e) =>
                                            dispatch2({ type: "password", payload: e.target.value })
                                        }
                                />
                            </Form.Group> 
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label className="label_form">Password Baru</Form.Label>
                                    <Form.Control 
                                        ref={ref2}
                                        size="sm"
                                        type="password" 
                                        placeholder="*********************"
                                        name='newpassword'
                                        onBlur={(e) =>
                                            dispatch2({ type: "newpassword", payload: e.target.value })
                                        }
                                />
                            </Form.Group>  
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label className="label_form">Konfirmasi Password</Form.Label>
                                    <Form.Control 
                                        ref={ref3}
                                        size="sm"
                                        type="password" 
                                        placeholder="*********************"
                                        name='confirmpassword'
                                        onBlur={(e) =>
                                            dispatch2({ type: "confirmpassword", payload: e.target.value })
                                        }
                                />
                            </Form.Group>                            
                                        
                            <Row className="btn_group">
                                <Col>                
                                    <Button variant="light" disabled={isLoading} className={styles.buttons} type="submit" onClick={submitPassword}>
                                        {
                                            isLoading === false ? (<>Ubah Password</>)
                                            :(<>
                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"
                                                />{" "} Loading... </>)
                                        }
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
                
            </Container>
        </section>
    );
}

