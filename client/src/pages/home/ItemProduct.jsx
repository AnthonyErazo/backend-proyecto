/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import ErrorPage from "../../error/ErrorPage";

function ItemProduct() {
    let { id } = useParams();
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setError(null)
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/products/${id}`);
                setProduct(response.data.payload);
                setLoading(false);
            } catch (error) {
                console.error(error.response.data.message)
                setError(error.response.data);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [id]);
    if (loading) return <Loading />
    if(error) return <ErrorPage errorMessage={error} />
    return (
        <div style={{ marginTop: "150px" }}>
            {product.title}
        </div>
    )
}

export default ItemProduct