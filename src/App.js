// import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/homePage/HomePage';
import Login from './pages/loginPage/LoginPage';
import Register from './pages/registerPage/RegisterPage';
import HomeNavigation from './components/homeNavigation/HomeNavigation';
import { useAuth } from './firebase/auth';
import DashboardPage from './pages/dashboardPage/DashboardPage';
import DashboardTransactionReport from './components/dashboardTransactionReport/DashboardTransactionReport';
import DashboardHome from './components/dashboardHome/DashboardHome';
import DashboardAccounts from './components/dashboardAccounts/DashboardAccounts';
import DashboardProvider from './pages/dashboardPage/DashboardProvider';
import DashboardExpense from './components/dashboardExpense/DashboardExpense';
import DashboardDeposit from './components/dashboardDeposit/DashboardDeposit';
import LoadingPage from './components/loadingPage/LoadingPage';
import NotAuthorizedPage from './pages/notAuthorizedPage/NotAuthorizedPage';
import PageDoesNotExist from './pages/pageDoesNotExist/PageDoesNotExist';
import DashboardReports from './components/dashboardReports/DashboardReports';
import ReportProvider from './components/dashboardReports/DashboardReportsProvider';
import PieChartExpense from './components/pieChartExpenseCategories/PieChartExpense';


function App() {
    const { authUser, isLoading } = useAuth();
    return (
        <>
            {   
                isLoading 
                ? 
                    <LoadingPage/>
                :       
                    <BrowserRouter>
                        { authUser 
                        ? 
                            <Routes>
                                <Route index element={<Navigate to={'/dashboard'}/>}></Route>
                                <Route path={'/dashboard'} element={
                                    <DashboardProvider>
                                        <DashboardPage />
                                    </DashboardProvider>
                                }>
                                    <Route path='' element={<DashboardHome/>}/>
                                    <Route path='reports' element={
                                        <ReportProvider>
                                            <DashboardReports/>
                                        </ReportProvider>
                                    }>  
                                        <Route path='history' element={<DashboardTransactionReport/>}></Route>
                                        <Route path='pie-chart-expense' element={<PieChartExpense/>}></Route>
                                    </Route> 
                                    <Route path='accounts' element= {<DashboardAccounts/>}/>
                                    <Route path='expense' element= {<DashboardExpense/>}/> 
                                    <Route path='deposit' element= {<DashboardDeposit/>}/> 
                                </Route>
                                <Route path='/home' element={<Navigate to={"/dashboard"}/>} />
                                <Route path={'/login'} element={<NotAuthorizedPage/>}/>
                                <Route path={'/register'} element={<NotAuthorizedPage/>}/>
                                <Route path={'*'} element={<PageDoesNotExist/>}></Route>
                            </Routes>
                        :
                            <>
                                <HomeNavigation/>
                                <Routes>
                                    <Route index element={<Navigate to={'/home'} />}></Route>
                                    <Route path={'/home'} element={<HomePage />}></Route>
                                    <Route path={'/login'} element={<Login/>}></Route>
                                    <Route path={'/register'} element={<Register />}></Route>
                                    <Route path={'/dashboard'} element={<NotAuthorizedPage/>}/>
                                    <Route path={'/dashboard/accounts'} element={<NotAuthorizedPage/>}/>
                                    <Route path={'/dashboard/reports'} element={<NotAuthorizedPage/>}/>
                                    <Route path={'/dashboard/deposit'} element={<NotAuthorizedPage/>}/>
                                    <Route path={'/dashboard/expense'} element={<NotAuthorizedPage/>}/>
                                    <Route path={'*'} element={<PageDoesNotExist/>}></Route>                        
                                </Routes>
                            </>
                        }
                </BrowserRouter>
            }
        </>
        
    );
}

export default App;
