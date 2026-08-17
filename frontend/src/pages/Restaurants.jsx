import { useEffect, useState } from "react";

import { getRestaurants } from "../services/api";

import RestaurantCard from "../components/RestaurantCard";


function Restaurants() {

    const [restaurants, setRestaurants] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        loadRestaurants();

    }, []);


    async function loadRestaurants() {

        try {

            setLoading(true);

            const data =
                await getRestaurants();

            setRestaurants(data);

        } catch (error) {

            console.log(
                "Restaurants error:",
                error.message
            );

            setError(
                error.message
            );

        } finally {

            setLoading(false);

        }

    }


    if (loading) {

        return (

            <div className="container">

                <h1>
                    Restaurants
                </h1>

                <p>
                    Loading restaurants...
                </p>

            </div>

        );

    }


    if (error) {

        return (

            <div className="container">

                <h1>
                    Restaurants
                </h1>

                <p>
                    Error: {error}
                </p>

            </div>

        );

    }


    return (

        <div className="container">

            <h1>
                Restaurants
            </h1>


            {restaurants.length === 0 ? (

                <p>
                    No restaurants available yet.
                </p>

            ) : (

                <div className="grid">

                    {restaurants.map(
                        (restaurant) => (

                            <RestaurantCard
                                key={restaurant._id}
                                restaurant={restaurant}
                            />

                        )
                    )}

                </div>

            )}

        </div>

    );

}


export default Restaurants;