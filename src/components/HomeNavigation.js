import { Link } from "react-router-dom";
import { useAuth } from "../firebase/auth";
import { logout } from "../services/firebaseAuthenticationManager";
import './HomeNavigation.css';
import logo from '../assests/images/logo.png';


export default function HomeNavigation() {
	const { authUser } = useAuth();

  	const handleOnClickLogout = () => {
		logout()
			.catch((error) => {
				console.log(error);
			});
  	}

	return (
		<nav className="navbar">
			<div className="navbar-logo">
				<Link to="/home">
					<img src={logo} alt="logo"/>
				</Link>
			</div>
			<ul className="navbar-links">
				<li className="navbar-link dropdown">
				<div className="welcomeBanner">Welcome to Smart Finance !</div>
				</li>
			</ul>
			{
				authUser 
				? 
					<ul className="navbar-actions">
						<li className="navbar-action" onClick={handleOnClickLogout}>
							<Link to="/home">Logout</Link>
						</li>
					</ul>
					:
					<ul className="navbar-actions">
						<li className="navbar-action">
							<Link to="/login">Login</Link>
						</li>
						<li className="navbar-action">
							<Link to="/register">Register</Link>
						</li>
					</ul>		
			}
		</nav>
	);
}
