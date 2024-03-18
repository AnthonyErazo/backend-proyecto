import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'
import { useState } from 'react';

function Navbar() {
  const [searchValue, setSearchValue] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const navigate = useNavigate();

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearchItem(searchValue);
    }
  }
  const handleSearchItem = (value) => {
    if(searchValue){
      navigate(`/search/${value}`);
    }
  }
  return (
    <header>
      <div className='container-logo'>
        <Link className='logo' to="/">
          <img alt="logo" />
          <p>Nombre tienda</p>
        </Link>
        <div className={`category ${showCategories ? 'active' : ''}`}>
          <div className='category-button' onClick={() => setShowCategories(!showCategories)}>
            <p>Categorias</p>
            <i className='ri-arrow-down-s-line' ></i>
          </div>
          {showCategories && (
            <div className='category-bar'>
              <ul>
                <li><Link to='/category1'>Categoría 1</Link></li>
                <li><Link to='/category2'>Categoría 2</Link></li>
                <li><Link to='/category3'>Categoría 3</Link></li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className='search-bar'>
        <input type="text"
          placeholder='Hola, ¿Qué estás buscando?'
          className='search'
          id="searchInput"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <i className='ri-search-line' onClick={() => handleSearchItem(searchValue)} ></i>
      </div>

      <div className="icons">
        <div className={`account ${showAccount ? 'active' : ''}`}>
          <div className='account-button' onClick={() => setShowAccount(!showAccount)}>
            <i className='ri-user-line' ></i>
            <p>My account</p>
            <i className='ri-arrow-down-s-line' ></i>
          </div>
          {showAccount && (
            <div className='account-bar'>
              <ul>
                <li><Link to='/category1'>My Account</Link></li>
                <li><Link to='/auth/register'>Register</Link></li>
                <li><Link to='/auth/login'>Login <i className='ri-logout-box-line'></i></Link></li>
                <li><Link to='/category3'>Logout <i className='ri-logout-box-r-line'></i></Link></li>
              </ul>
            </div>
          )}
        </div>
        <Link className='cart' to="/cart">
          <i className='ri-shopping-cart-2-fill' ></i>
        </Link>
      </div>
    </header >
  )
}

export default Navbar