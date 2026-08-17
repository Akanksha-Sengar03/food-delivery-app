import { useEffect, useState } from "react";

import { getFoods } from "../services/api";

import FoodCard from "../components/FoodCard";


function Foods() {

    const [foods, setFoods] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        loadFoods();

    }, []);


    async function loadFoods() {

        try {

            const data =
                await getFoods();

            setFoods(data);

        } catch (error) {

            console.log(
                "Foods error:",
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
                    All Foods
                </h1>

                <p>
                    Loading foods...
                </p>

            </div>

        );

    }


    if (error) {

        return (

            <div className="container">

                <h1>
                    All Foods
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
                All Foods
            </h1>


            {foods.length === 0 ? (

                <p>
                    No foods available yet.
                </p>

            ) : (

                <div className="grid">

                    {foods.map((food) => (

                        <FoodCard
                            key={food._id}
                            food={food}
                        />

                    ))}

                </div>

            )}

        </div>

    );

}


export default Foods;