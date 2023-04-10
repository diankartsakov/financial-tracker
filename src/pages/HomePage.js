import "./homePage.css";

import underConstructionIMG from "../assests/images/under-construction_geek_man.svg"

import userManager from "../services/UserManager";

export default function HomePage() {

    return (
        <>
            <div className="homePage">
                <h2>Home Page</h2>
                <div className="underConstruction">
                    <img src={underConstructionIMG} alt="" />
                </div>
                <button onClick={() => userManager.addTransaction(
                    'Hh6biGjH5wjZpITS9E6D',
                    100,
                    '',
                    'Deposit'
                )}>Firestore Test</button>
            </div>
        </>
    );
}