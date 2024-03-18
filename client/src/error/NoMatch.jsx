import { Link } from 'react-router-dom';
import './styles/NoMatch.css';

function NoMatch() {
  return (
    <section className="page_404">
      <div className="container-page">
        <div className="info-page">
          <div className="four_zero_four_bg">
            <h1>404</h1>
          </div>
          <div className="contant_box_404">
            <h2>
            Lo sentimos, la página que estás buscando no existe.
            </h2>
            <p>¿Quieres volver al inicio?</p>
            <Link to='/' className="link_404">Ir al inicio</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NoMatch;
