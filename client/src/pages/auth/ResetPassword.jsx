import { Link } from "react-router-dom"
import ToastNotification from "../../components/ToastNotification/ToastNotification"
import Loading from "../../components/Loading";
import { useState } from "react";
import axios from "axios";

function ResetPassword() {
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [formData, setFormData] = useState({
        email: ''
    });
    const resetForm = () => {
        setFormData({
            email: ''
        })
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        const fetchProducts = async () => {
            try {
                const response=await axios.post(`http://localhost:8080/api/sessions/forgot-password`, formData,{
                    withCredentials: true 
                });
                const alertResponse = {
                    id_toast: new Date().toString(),
                    message: response.data.message,
                    duration: 4600,
                    type: 'success',
                    status_code: 200
                };
                setAlert(alertResponse)
                setLoading(false);
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
                resetForm();
            }
        };
        fetchProducts();
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
                    <button type="submit">Reset Password</button>
                </form>
                <p>¿Ya tienes una cuenta? <Link to="/auth/login">Inicia sesión aquí</Link>.</p>
                <p>¿No tienes una cuenta? <Link to="/auth/register">Regístrate aquí</Link>.</p>
                <p>Regresar a la <Link to="/">Página de Inicio</Link>.</p>
            </div>
            <ToastNotification alert={alert} />
        </>
    )
}

export default ResetPassword