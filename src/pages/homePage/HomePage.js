import "./homePage.scss";
import startGif from "../../assests/images/imageedit_4_9427188444.gif";
import underConstructionIMG from "../../assests/images/under-construction_geek_man.svg"

// blue: #85C3E9;
// white: #FFFFFF;

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
            <div className="homePage">
                <h2>Home Page</h2>
                <div className="underConstruction">
                    <img src={underConstructionIMG} alt="" />
                </div>
            </div>
        </>

    );
}