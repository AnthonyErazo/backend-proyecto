/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react"
import axios from "axios";
import { useParams } from "react-router-dom";
import ErrorPage from "../../error/ErrorPage";
import Loading from "../../components/Loading";

/* eslint-disable react/prop-types */
function SearchPage() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { term } = useParams();
    
    useEffect(() => {
        setError(null)
        setLoading(true)
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/products?term=${term}&query={"status":"true"}`);
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error.response.data.message)
                setError(error.response.data)
                setLoading(false);
            }
        };

        fetchProducts();
    }, [term])
    if(loading) return <Loading />
    if(error) return <ErrorPage errorMessage={error} />
    return (
        <div>SearchPage</div>
    )
}

export default SearchPage