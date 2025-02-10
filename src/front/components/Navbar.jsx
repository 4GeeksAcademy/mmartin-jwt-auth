import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { logOut } from "../utils";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer()

	const handleLogout = () => {
		logOut(dispatch)()
	}

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1 brand">Secret Messages</span>
				</Link>
				<div className="ml-auto d-flex justify-content-between">
					<Link className="mx-2" to="/">
						<button>Login</button>
					</Link>
					<Link className="mx-2" to="/signup">
						<button>Create Account</button>
					</Link>
					<Link className="mx-2" to="/">
						<button onClick={handleLogout}>Logout</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};