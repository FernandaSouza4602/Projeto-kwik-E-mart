import {useState} from 'react';
import Swal from 'sweetalert2'
import './index.css';


function Login () {

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const logar = () => {
        if(!email || !senha){

            Swal.fire({
                icon: 'error',
                text: 'Os campos de e-mail e senha são obrigatórios!',
            });
            return;
        }
    };


    return (
        <div class="caixa-login">
        <div class="titulo-login">
            <h1>Login</h1>
        </div>

        <div class="grupo">
            <label for="email">E-mail</label> <br/>
            <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="exemplo@exemplo.com" />
        </div>

        <div class="grupo">
            <label for="senha">Senha</label> <br/>
            <input id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} type="password" />
        </div>

        <div class="esqueci-minha-senha">
            <a href="#"> Esqueci minha senha</a>
        </div>

        <button id="btn-entrar" onClick={logar}>Entrar</button>
    </div>
  )
}

export default Login;