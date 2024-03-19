/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/Register.css'
import axios from 'axios';
import Loading from '../../components/Loading';
import ToastNotification from '../../components/ToastNotification/ToastNotification';

function Register() {
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        birthdate: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDateChange = (date) => {
        setFormData({ ...formData, birthdate: date.toISOString() });
    };
    const resetForm = () => {
        setFormData({
            first_name: '',
            last_name: '',
            email: '',
            birthdate: '',
            password: ''
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        const fetchProducts = async () => {
            try {
                const response = await axios.post(`http://localhost:8080/api/sessions/register`, formData);
                console.log(response)
                const alertResponse = {
                    id_toast: new Date().toString(),
                    message: response.data.message,
                    duration: 4600,
                    type: 'success',
                    status_code: 200
                };
                setAlert(alertResponse)
                setLoading(false);
                resetForm();
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
                setLoading(false);
            }
        };

        fetchProducts();
    };


    if (loading) return <Loading />

    return (
        <>
            <div className="container">
                <h2>Registro</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="first_name" className="form-label">First Name:</label>
                        <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} className="form-control" autoComplete="given-name" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="last_name" className="form-label">Last Name:</label>
                        <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} className="form-control" autoComplete="family-name" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="form-control" autoComplete="email" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password:</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="form-control" autoComplete="new-password" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="birthdate" className="form-label">Fecha de nacimiento:</label>
                        <br />
                        <DatePicker
                            id="birthdate"
                            name="birthdate"
                            selected={formData.birthdate}
                            onChange={handleDateChange}
                            className="form-control"
                            dateFormat="dd/MM/yyyy"
                            showYearDropdown
                            scrollableYearDropdown
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Registrarse</button>
                </form>
                <p>¿Ya tienes una cuenta? <Link to="/auth/login">Inicia sesión aquí</Link>.</p>
                <p>Regresar a la <Link to="/">Página de Inicio</Link>.</p>
            </div>
            <ToastNotification alert={alert} />
        </>
    );
}

export default Register;
