import { useDispatch } from "react-redux";

import { addToCart } from "../store/cartSlice";


function FoodCard({ food }) {

    const dispatch = useDispatch();


    function handleAddToCart() {

        dispatch(
            addToCart(food)
        );

        alert(
            `${food.name} added to cart`
        );

    }


    return (

        <div className="food-card">

            <div className="food-image">

                {food.image ? (

                    <img
                        src={food.image}
                        alt={food.name}
                    />

                ) : (

                    <div className="food-placeholder">
                        🍽️
                    </div>

                )}

            </div>


            <div className="food-card-content">

                <span className="food-category">
                    {food.category}
                </span>


                <h2>
                    {food.name}
                </h2>


                {food.description && (

                    <p className="food-description">
                        {food.description}
                    </p>

                )}


                <div className="food-card-bottom">

                    <span className="food-price">
                        ₹{food.price}
                    </span>


                    <button
                        className="add-cart-button"
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </button>

                </div>

            </div>

        </div>

    );

}


export default FoodCard;