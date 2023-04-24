import "./homePage.scss";
import startGif from "../../assests/images/imageedit_4_9427188444.gif";
import planner from "../../assests/images/planner.png"
import whereMoneyGoIMG from "../../assests/images/where-money-go.png"
import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <>
            <div className="start-section">
                <div className="start-section-content-wrapper">
                    <div className="moto-wrapper">
                        <h1 className="moto">"Stay on top of your finances with our system"</h1>
                        <p>"Take control of your money and your future with our powerful finance tracker. Stay on top of your spending, maximize your savings, and achieve your financial goals with ease!"</p>
                    </div>
                    <div className="gif-wrapper">
                        <img src={startGif}></img>
                    </div>
                </div>
                <div className="custom-shape-divider-bottom-1681582518">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
                    </svg>
                </div>    
            </div>    
            <div className="info-where">
                <div className="info-where-wrapper">
                    <div className="info-where-description">
                        <h2 className="info-where-description-title">Stay on Top of Your Expenses</h2>
                        <p className="info-where-description-text">Smart Finance makes it easy to create a budget and track your spending, so you can make smarter financial decisions.</p>
                        <Link className="link-register-button" to="/register">Start Tracking Your Spending Now</Link>
                    </div>
                    <div className="info-where-img-wrapper">
                        <img src={whereMoneyGoIMG} alt="logo where money go"/>
                    </div>
                </div>
            </div>
            <div className="slogan">
                <div className="slogan-wrapper">
                        <h2 className="slogan-title">Spend less time stressing, and more time living with our finance app</h2>
                        <p className="slogan-text">Our finance app takes the hassle out of managing your money, so you can spend less time stressing about finances and more time enjoying life. With our easy-to-use interface and powerful features, you'll have everything you need to stay on top of your finances and achieve your goals.</p>
                </div>
            </div>

            {/* Spend less time stressing, and more time living with our finance app. */}
            <div className="info-where">
                <div className="info-where-wrapper">
                    <div className="info-where-description">
                        <h2 className="info-where-description-title">Plan smarter, spend better</h2>
                        <p className="info-where-description-text">Our finance app helps you plan smarter by creating a personalized budget and tracking your expenses. With these powerful tools, you can make informed financial decisions and spend better, ultimately achieving your financial goals and living the life you want.</p>
                        <Link className="link-register-button" to="/register">Plan smarter, spend better and succeed Now</Link>
                    </div>
                    <div className="info-where-img-wrapper">
                        <img src={planner} className="planner" alt="logo where money go"/>
                    </div>
                </div>
            </div>
        </>

    );
}