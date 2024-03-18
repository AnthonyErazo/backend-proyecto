import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/Login.css'
import axios from 'axios';
import Loading from '../../components/Loading';
import ToastNotification from '../../components/ToastNotification/ToastNotification';

function Login() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [alert, setAlert] = useState(null);
    axios.defaults.withCredentials=true; 
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const resetForm = () => {
        setFormData({
            email: '',
            password: ''
        })
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // setLoading(true)
        const fetchProducts = async () => {
            try {
                const response = await axios.post(`http://localhost:8080/api/sessions/login`, formData);
                console.log(response)
                setLoading(false);
                // navigate('/cart');
            } catch (error) {
                console.error(error.response.data.message)
                const alertError = {
                    id_toast: new Date().toString(),
                    message: error.response.data.cause,
                    duration: 4600,
                    type: 'error',
                    status_code: 400
                };
                setAlert(alertError)
                // setLoading(false);
            }
        };
        fetchProducts();
        resetForm();
    };

    if (loading) return <Loading />
    return (
        <>
            <div>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} autoComplete="username" />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} autoComplete="current-password" />
                    </div>
                    <button type="submit">Login</button>
                </form>
                <p>¿No tienes una cuenta? <Link to="/auth/register">Regístrate aquí</Link>.</p>
                <p>Regresar a la <Link to="/">Página de Inicio</Link>.</p>
            </div>
            <ToastNotification alert={alert} />
        </>
    );
}

export default Login;
