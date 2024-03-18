/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import './ToastNotification.css'

function ToastNotification({ alert }) {
    const [toasts, setToasts] = useState([]);
    useEffect(() => {
        if (alert) {
            addToasts(alert);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alert]);

    const removeAlertById = (alertId) => {
        setToasts(toasts.filter(alert => alert.id_toast !== alertId));
    };

    const addToasts = (alert) => {
        setToasts([...toasts, alert]);

        setTimeout(() => {
            const alertElement = document.getElementById(`toast-${alert.id_toast}`);
            if (alertElement) {
                alertElement.classList.add('toast-hide');
            }
        }, alert.duration);

        setTimeout(() => {
            removeAlertById(alert.id_toast);
        }, alert.duration);
    };

    const generateSuccessAlert = (toast) => {
        return (
            <div className="mt-5 mx-4 px-4 rounded-md bg-green-50 md:max-w-2xl md:mx-auto">
                <div className="flex justify-between py-3">
                    <div className="flex">
                        <div className="text-green-500 text-2xl">
                            <i className="ri-check-fill"></i>
                        </div>
                        <div className="self-center ml-3">
                            <span className="text-green-600 font-semibold capitalize">{toast.type}</span>
                            <p className="text-green-600 mt-1">{toast.message}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const generateDangerAlert = (toast) => {
        return (
            <div className="mt-5 mx-4 px-4 rounded-md bg-red-50 md:max-w-2xl md:mx-auto">
                <div className="flex justify-between py-3">
                    <div className="flex">
                        <div className="text-red-500 text-2xl">
                            <i className="ri-alert-fill"></i>
                        </div>
                        <div className="self-center ml-3">
                            <span className="text-red-600 font-semibold capitalize">{toast.type}</span>
                            <p className="text-red-600 mt-1">{toast.message}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed top-7 right-5 animate__animated animate__fadeIn notifications">
            {toasts.length != 0 ? toasts.map(toastView => {
                return toastView.type === 'success' ?
                    <div key={toastView.id_toast} className="toast-alert-success" id={`toast-${toastView.id_toast}`}>
                        {generateSuccessAlert(toastView)}
                    </div>
                    :
                    <div key={toastView.id_toast} className="toast-alert-danger" id={`toast-${toastView.id_toast}`}>
                        {generateDangerAlert(toastView)}
                    </div>
            }
            ) : null}
        </div>
    );
}

export default ToastNotification;
