import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'react-toastify/dist/ReactToastify.css';
import '../src/styles/main.scss'
import Modal from 'react-modal';
import Navbar from './components/Navbar/Navbar.jsx';
Modal.setAppElement('#root');




ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <App />
  </React.StrictMode>,
)
