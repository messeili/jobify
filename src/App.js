import Routes from './routes';
import AuthProvider from './context/auth';
import SocketProvider from './context/socket';
import Header from './components/header/';
import Footer from './components/footer/';
import ScrollTop from './components/helpers/scroll-top';
import { BrowserRouter } from 'react-router-dom';
import Chat from './components/chat';
import Notification from './components/notification';
import './app.scss';

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <ScrollTop />
          <Notification />
          <Chat />
          <div id='contAnima' className='page-container'>
            <div className='content-wrap'>
              <Header />
              <Routes />
            </div>
            <Footer />
          </div>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
