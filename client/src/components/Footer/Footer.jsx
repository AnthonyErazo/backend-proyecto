import { Link } from "react-router-dom"
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="section__container footer__container">
        <div className="footer__col">

          <div className="footer-logo-nucleo">
            <img alt="logo" />
            <h4>Nombre tienda</h4>
          </div>
          <p>
            descripcion de la tienda
          </p>
          <div className="footer__socials">
            <span>
              <a href="#" target="_blank"><i
                className="ri-facebook-circle-fill"></i></a>
            </span>
            <span>
              <a href="#" target="_blank"><i className="ri-instagram-line"></i></a>
            </span>
            <span>
              <a href="#" target="_blank"><i
                className="ri-linkedin-box-fill"></i></a>
            </span>
            <span>
              <a href="#" target="_blank"><i className="ri-youtube-fill"></i></a>
            </span>
          </div>
        </div>
        <div className="footer__col">
          <h4>Menú</h4>
          <p><Link to="/">Inicio</Link></p>
          <p><Link to="/">Categorias</Link></p>
          <p><Link to="/">Inicio</Link></p>
        </div>
        <div className="footer__col">
          <h4>Recursos</h4>
          <a>Términos</a>
          <a>Condiciones</a>
          <a>Política</a>
        </div>
        <div className="footer__col">
          <h4>Contacto</h4>
          <a href="mailto:anthonyerazo76@gmail.com" target="_blank">
            <div className="flex items-center"><span><i className="ri-mail-line"></i></span> anthonyerazo76@gmail.com </div>
          </a>
        </div>
      </div>

      <div className="line-separator">
        <hr />
      </div>

      <div className="footer__bar">
        © 2024 - Anthony. Todos los derechos reservados.
      </div>
    </footer>
  )
}

export default Footer