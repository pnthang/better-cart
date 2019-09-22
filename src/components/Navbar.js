import React from 'react';
import { Link } from 'react-router-dom'
const Navbar = ()=>{
    return(
            <nav className="nav-wrapper">
                <div className="container">
                    <Link to="/" className="brand-logo">Nellies Kitchen</Link>                    
                    <ul className="right">                        
                        <li><Link to="#"><i className="material-icons">shopping_cart</i></Link></li>
                    </ul>
                </div>
            </nav>           
    )
}

export default Navbar;