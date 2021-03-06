/* eslint-disable no-unused-vars */
import { Container, Row, Col, Card, Image, Form, Button, Alert, Tab, Nav, Modal, Spinner } from 'react-bootstrap';
import { useContext, useState, useEffect } from 'react';
import { If, Else, Then } from 'react-if';
import { AuthContext } from '../../context/auth';
import superagent from 'superagent';
import './styles.scss';
import { MDBContainer } from 'mdbreact';
import { useHistory } from 'react-router-dom';

export default function UserApplications() {
  let history = useHistory();
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  const context = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [id, setId] = useState(0);
  const [loader, setLoader] = useState(false);
  const [apiLength, setApiLength] = useState(0);
  const [dataLocation, setDataLocation] = useState('');
  const scrollContainerStyle = { width: 'auto', maxHeight: '300px', height: 'fit-content', overflowY: 'scroll', overflowX: 'hidden', padding: 0 };
  const scrollContainerStyle2 = { width: 'auto', maxHeight: '500px', height: 'fit-content', overflowY: 'scroll', overflowX: 'hidden', padding: 0 };
  const API = 'https://jobify-app-v2.herokuapp.com/user';

  async function getData() {
    const response = await superagent.get(`${API}/app`).set('authorization', `Basic ${context.token}`);
    setData([...response.body.API, ...response.body.DB]);
    setApiLength(response.body.API.length);
  }
  const deleteJob = (id, payload) => {
    setLoader(true);
    if (payload === 'DB') {
      superagent
        .delete(`${API}/app/${id}`)
        .set('authorization', `Basic ${context.token}`)
        .then((data) => {
          getData();
          setLoader(false);
          setShow(false);
        });
    } else {
      superagent
        .delete(`${API}/app-api/${id}`)
        .set('authorization', `Basic ${context.token}`)
        .then((data) => {
          getData();
          setLoader(false);
          setShow(false);
        });
    }
  };

  const checkSize = () => {
    setScreenSize(window.screen.width);
  };

  useEffect(() => {
    window.addEventListener('resize', checkSize);
    if (context.token) {
      getData();
    }
    return () => {
      window.removeEventListener('resize', checkSize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenSize, context.token]);

  return (
    <>
      <Container style={{ justifyContent: 'center', width: '85%' }}>
        <Row sm={8}>
          <Col style={{ color: '#515151', fontSize: 40, fontWeight: 700, textAlign: 'center' }}>My Applications</Col>
        </Row>
        <If condition={context.token && data[0]}>
          <Then>
            <Container className='list-container' style={{ marginTop: '20px',padding:0 }} fluid>
              <Row sm={8} className='flexRow list-header' style={{ height: screenSize > '575' ? '80px' : '130px',margin:0 }}>
                <Col style={{ color: '#515151', fontWeight: 660, textAlign: screenSize > '575' ? 'center' : 'center' }} className='col-title' sm={1}></Col>
                <Col style={{ color: '#515151', fontWeight: 660, textAlign: screenSize > '575' ? 'center' : 'center' }} className='col-title' sm={2}>
                  Job Title
                </Col>
                <Col style={{ color: '#515151', fontWeight: 660, textAlign: screenSize > '575' ? 'center' : 'center' }} sm={3}>
                  Company Name
                </Col>
                <Col style={{ color: '#515151', fontWeight: 660, textAlign: screenSize > '575' ? 'center' : 'center' }} sm={2}>
                  Job Type
                </Col>
                <Col style={{ color: '#515151', fontWeight: 660, textAlign: screenSize > '575' ? 'center' : 'center' }} sm={2}>
                  Application Status
                </Col>
                <Col sm={1}>
                  <If condition={loader}>
                    <Col style={{ color: '#515151', fontWeight: 660, textAlign: screenSize > '575' ? 'center' : 'center' }} sm={2}>
                      <Spinner animation='border' variant='primary' />
                    </Col>
                  </If>
                </Col>
              </Row>
              <Modal show={show} onHide={() => setShow(false)} dialogClassName='modal-50w' aria-labelledby='example-custom-modal-styling-title'>
                <Modal.Header closeButton>
                  <Modal.Title id='example-custom-modal-styling-title'>Delete Job</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>Are you sure that you want to DELETE this job?</p>
                  <Button className='button' onClick={() => deleteJob(id, dataLocation)} variant='outline-light' style={{ backgroundColor: '#E85D67' }}>
                    Delete
                  </Button>
                </Modal.Body>
              </Modal>
              <MDBContainer className='scrollbar scrollbar-primary  mt-5 mx-auto' style={screenSize > 575 ? scrollContainerStyle : scrollContainerStyle2}>
                {data.map((item, index) => {
                  return (
                    <Row className='flexRow list-body' sm={8}>
                      <Col style={{ fontWeight: 650, textAlign: screenSize > '575' ? 'center' : 'center' }} sm={1}>
                        <Image style={{ width: '50px', height: '50px', objectFit: 'cover' }} src={item.logo} roundedCircle />
                      </Col>
                      <Col style={{ textAlign: screenSize > '575' ? 'center' : 'center', color: '#515151' }} sm={2}>
                        {item.title}
                      </Col>
                      <Col style={{ textAlign: screenSize > '575' ? 'center' : 'center', color: '#515151' }} sm={3}>
                        {item.company_name}
                      </Col>
                      <Col style={{ textAlign: screenSize > '575' ? 'center' : 'center', color: '#515151' }} sm={2}>
                        {item.type}
                      </Col>
                      <Col style={{ textAlign: screenSize > '575' ? 'center' : 'center', fontWeight: 700, color: item.status === 'Accepted' ? '#69D95B' : item.status === 'Rejected' ? '#B72525' : '#515151' }} className='button-col' sm={2}>
                        {item.status}
                      </Col>
                      <Col style={{ textAlign: screenSize > '575' ? 'center' : 'center' }} className='button-col' sm={2}>
                        <If condition={apiLength < index + 1}>
                          <Then>
                            <Button
                              className='button'
                              style={{ backgroundColor: '#504edf' }}
                              onClick={() => {
                                setShow(true);
                                setId(item.id);
                                setDataLocation('DB');
                              }}
                              variant='praimary'
                            >
                              Delete
                            </Button>
                          </Then>
                          <Else>
                            <Button
                              className='button'
                              style={{ backgroundColor: '#504edf' }}
                              onClick={() => {
                                setShow(true);
                                setId(item.id);
                                setDataLocation('API');
                              }}
                              variant='praimary'
                            >
                              Delete
                            </Button>
                          </Else>
                        </If>
                      </Col>
                    </Row>
                  );
                })}
              </MDBContainer>
            </Container>
          </Then>
          <Else>
            <Row sm={8}>
              <Col style={{ color: '#717171', fontSize: 35, fontWeight: 400, textAlign: 'center', marginTop: 30 }}>You don't have any Application</Col>
            </Row>
          </Else>
        </If>
      </Container>
    </>
  );
}
