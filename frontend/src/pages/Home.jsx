import { Link } from "react-router-dom";


function Home() {

    return (

        <div className="home-page">

            {/* HERO SECTION */}

            <section className="hero">

                <div className="hero-content">

                    <p className="hero-tag">
                        🍴 Delicious food, delivered to you
                    </p>


                    <h1>
                        Your Favourite Food,
                        <br />
                        Delivered Fast 🚀
                    </h1>


                    <p className="hero-description">
                        Discover delicious food from your
                        favourite restaurants and get it
                        delivered right to your doorstep.
                    </p>


                    <div className="hero-buttons">

                        <Link
                            to="/foods"
                            className="primary-button"
                        >
                            Explore Foods
                        </Link>


                        <Link
                            to="/restaurants"
                            className="secondary-button"
                        >
                            Browse Restaurants
                        </Link>

                    </div>

                </div>


                <div className="hero-emoji">

                    🍕
                    🍔
                    🍟

                </div>

            </section>


            {/* FEATURES */}

            <section className="features">

                <div className="feature-card">

                    <div className="feature-icon">
                        🚀
                    </div>

                    <h3>
                        Fast Delivery
                    </h3>

                    <p>
                        Get your favourite food
                        delivered quickly.
                    </p>

                </div>


                <div className="feature-card">

                    <div className="feature-icon">
                        🍽️
                    </div>

                    <h3>
                        Delicious Food
                    </h3>

                    <p>
                        Choose from a variety
                        of tasty meals.
                    </p>

                </div>


                <div className="feature-card">

                    <div className="feature-icon">
                        🏪
                    </div>

                    <h3>
                        Best Restaurants
                    </h3>

                    <p>
                        Explore food from
                        local restaurants.
                    </p>

                </div>

            </section>


            {/* CALL TO ACTION */}

            <section className="home-cta">

                <h2>
                    Hungry? Let's get started! 😋
                </h2>

                <p>
                    Find something delicious today.
                </p>


                <Link
                    to="/foods"
                    className="primary-button"
                >
                    Order Now
                </Link>

            </section>

        </div>

    );

}


export default Home;