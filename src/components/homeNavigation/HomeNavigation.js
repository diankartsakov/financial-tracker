import { Link } from "react-router-dom";
import './HomeNavigation.scss';
import logo from '../../assests/images/logo.png';

export default function HomeNavigation() {
	return (
		<nav className="navbar">
			<div className="navbar-wrapper">
				<div className="navbar-logo">
					<Link to="/home" className="logo-link">
						<img src={logo} alt="logo"/>
						<h2>Smart Finance</h2>
					</Link>
				</div>
				<ul className="navbar-actions">
					<Link className="navbar-action navbar-login" to="/login">
						<li >
							Login
						</li>
					</Link>
					<Link className="navbar-action navbar-register" to="/register">
						<li >
							Register
						</li>
					</Link>
				</ul>						
			</div>
		</nav>
	);
}
