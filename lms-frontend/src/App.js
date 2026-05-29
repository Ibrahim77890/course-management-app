import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Auth from './pages/Auth';
import Home from './pages/Home';
import NewCourse from './pages/NewCourse';
import Course from './pages/Course';
import Dashboard from './pages/Dashboard';
import UserCourse from './pages/UserCourse';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import CartSucess from './pages/CartSucess';

function App() {
  return (
    <div className="App bg-gray-300">
      <Router>
        <Routes>
          <Route path='/' element={<Auth />} />
          <Route path='/home' element={<Home/>}/>
          <Route path='/enrolled' element={<Dashboard/>} />
          <Route path='/completed' element={<UserCourse/>} />
          <Route path='/admin-panel' element={<Admin/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/cart/success' element={<CartSucess/>} />
          <Route path='/home/new-course' element={<NewCourse/>} />
          <Route path='/home/delete-course' element={<NewCourse/>} />
          <Route path='/home/update-course' element={<NewCourse/>} />
          <Route path='/home/course/:courseId' element={<Course/>} />
          <Route path='/your-course' element={<UserCourse/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
