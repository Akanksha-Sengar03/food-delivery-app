function RestaurantCard({ restaurant }) {

    return (

        <div className="restaurant-card">

            <div className="restaurant-image">

                {restaurant.image ? (

                    <img
                        src={restaurant.image}
                        alt={restaurant.name}
                    />

                ) : (

                    <div className="restaurant-placeholder">
                        🏪
                    </div>

                )}

            </div>


            <div className="restaurant-card-content">

                {restaurant.category && (

                    <span className="restaurant-category">
                        {restaurant.category}
                    </span>

                )}


                <h2>
                    {restaurant.name}
                </h2>


                {restaurant.description && (

                    <p className="restaurant-description">
                        {restaurant.description}
                    </p>

                )}


                {restaurant.address && (

                    <p className="restaurant-address">
                        📍 {restaurant.address}
                    </p>

                )}

            </div>

        </div>

    );

}


export default RestaurantCard;