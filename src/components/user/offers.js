/* eslint-disable no-unused-vars */
import { Container, Row, Col, Card, Image, Form, Button, Alert, Tab, Nav, Modal, Spinner, DropdownButton, Dropdown } from 'react-bootstrap';
import { useContext, useState, useEffect } from 'react';
import { If, Then } from 'react-if';
import { AuthContext } from '../../context/auth';
import superagent from 'superagent';
import './styles.scss';

import { useHistory } from 'react-router-dom';

export default function UserOffers() {
  const context = useContext(AuthContext);
  let history = useHistory();
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);

  const [loader, setLoader] = useState(false);
  const [appStatus, setAppStatus] = useState('');

  const API = 'https://jobify-app-v2.herokuapp.com/user/offers';

  async function getData() {
    const response = await superagent.get(`${API}`).set('authorization', `Basic ${context.token}`);
    console.log('osama', response.body);
    setData(response.body);
  }
  const rejectApp = (id, payload) => {
    let status1 = '';
    if (payload === 'Rejected') {
      status1 = 'Rejected';
    } else {
      status1 = 'Accepted';
    }
    setLoader(true);
    console.log('Heerr', id, payload);
    superagent
      .put(`${API}/${id}`)
      .send({ status: status1 })
      .set({ Authorization: `Basic ${context.token}` })
      .then((data) => {
        console.log(data);
        getData();
        setLoader(false);
      });
  };

  useEffect(() => {
    if (context.token) {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.token]);

  return (
    <>
      <Container style={{ marginTop: '150px' }}>
        <Container style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '35px', fontWeight: 'bold', color: '#504edf' }}>My Offers</h2>
        </Container>
        <Container className='list-container' style={{ marginTop: '20px' }} fluid>
          <Row sm={8} className='flexRow list-header'>
            <Col style={{ color: '#717171', fontWeight: 550, textAlign: 'center' }} className='col-title' sm={2}></Col>
            <Col style={{ color: '#717171', fontWeight: 550, textAlign: 'center' }} className='col-title' sm={2}>
              Job Title
            </Col>
            <Col style={{ color: '#717171', fontWeight: 550, textAlign: 'center' }} sm={2}>
              Company Name
            </Col>
            <Col style={{ color: '#717171', fontWeight: 550, textAlign: 'center' }} sm={2}>
              Job Type
            </Col>
            <Col style={{ color: '#717171', fontWeight: 550, textAlign: 'center' }} sm={1}>
              Country
            </Col>
            <Col style={{ color: '#717171', fontWeight: 550, textAlign: 'center' }} sm={1}>
              Status
            </Col>
            <Col sm={2}>
              <If condition={loader}>
                <Col style={{ color: '#717171', fontWeight: 550 }} sm={2}>
                  <Spinner animation='border' variant='primary' />
                </Col>
              </If>
            </Col>
          </Row>

          {data.map((item) => {
            return (
              <Row className='flexRow list-body' sm={8}>
                <Col style={{ fontWeight: 650 }} sm={2}>
                  <Image style={{ width: '50px' }} src={item.logo} roundedCircle />
                </Col>
                <Col style={{ textAlign: 'left', color: '#9393A1' }} sm={2}>
                  {item.title}
                </Col>
                <Col style={{ textAlign: 'center', color: '#9393A1' }} sm={2}>
                  {item.company_name}
                </Col>
                <Col style={{ textAlign: 'center', color: '#9393A1' }} sm={2}>
                  {item.type}
                </Col>
                <Col style={{ textAlign: 'center' }} className='button-col' sm={1}>
                  {item.country}
                </Col>
                <Col style={{ textAlign: 'center', color: '#9393A1' }} sm={1}>
                  {item.status}
                </Col>
                <Col style={{ textAlign: 'center', display: 'flex', flexDirection: 'row' }} className='button-col' sm={2}>
                  <Button className='button' onClick={() => rejectApp(item.id, 'Accepted')} variant='outline-light' style={{ backgroundColor: '#504edf', paddingRight: '60px' }}>
                    Accept
                  </Button>
                  <Button className='button' onClick={() => rejectApp(item.id, 'Rejected')} variant='outline-light' style={{ backgroundColor: '#504edf', paddingRight: '60px' }}>
                    Reject
                  </Button>
                </Col>
              </Row>
            );
          })}
        </Container>
      </Container>
    </>
  );
}
