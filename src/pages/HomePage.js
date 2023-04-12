import "./homePage.css";

import underConstructionIMG from "../assests/images/under-construction_geek_man.svg"


export default function HomePage() {

    return (
        <>
            <div className="homePage">
                <h2>Home Page</h2>
                <div className="underConstruction">
                    <img src={underConstructionIMG} alt="" />
                </div>
            </div>
        </>

    );
}