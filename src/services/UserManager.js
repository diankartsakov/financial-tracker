// import axios from "axios";

class UserManager {
    constructor() {
        this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    }

    loggedUser = null;

    register = (username, password) => {

    };

    login = (username, password) => {

    };

    logout = () => {

        this.loggedUser = null;
    };
}

let userManager = new UserManager();

export default userManager;


