import '../App.css';
import cuvettelogo from './static/cuvettelogo.png';
export default function NavbarSignup (){
    return (
        <div className="navbarSignup">
          <div className="navbar-content">
          <img src={cuvettelogo}  className="logo" /> 
              <div className="contact">
              <a href="">Contact</a>
            </div>
          </div>
        </div>
      );
}