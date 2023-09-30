import './index.css';

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import usuarioService from '../../service/usuario-service';




function Menu(){

    const logout = () =>{
        usuarioService.sairSistema();
    };

    if(useLocation().pathname !== '/login'){
        return (
            <ul className='menu'>
                <li><Link to='/'>kwik-E-mart</Link></li>
                <li><Link to='/clientes'>Clientes</Link></li>
                <li><Link to='/produtos'>Produtos</Link></li>
                <li><Link onClick={logout}>Sair <i class="fas fa-door-open "></i></Link></li>
            </ul>
        )
    }else {
        return null;    //retorna nada para o componente não ser renderizado no DOM
    }
}

export default Menu;