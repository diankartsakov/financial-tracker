import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import HomeNavigation from './components/HomeNavigation';
import { useAuth } from './firebase/auth';


function App() {
    const { isLoading } = useAuth();
    return (
        <>
            {   
                isLoading 
                ? 
                    <div>Loading... </div>
                :       
                    <BrowserRouter>
                        <HomeNavigation/>
                        <Routes>
                            <Route index element={<Navigate to={'/home'} />}></Route>
                            <Route path={'/home'} element={<HomePage />}></Route>
                            <Route path={'/login'} element={<Login/>}></Route>
                            <Route path={'/register'} element={<Register />}></Route>
                            <Route path={'*'} element={<div>PAGE NOT FOUND !</div>}></Route>
                        </Routes>
                    </BrowserRouter>
            }
        </>
        
    );
}

export default App;
