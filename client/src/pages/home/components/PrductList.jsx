/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"

function PrductList({ product }) {
    return (
        <li>
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <p>Precio: ${product.price}</p>
            <button>
                <Link to={`/product/${product.id}`}>
                    Ver mas
                </Link>
            </button>
        </li>
    )
}

export default PrductList