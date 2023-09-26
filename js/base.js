function salvarToken(token){
    localStorage.setItem('token', token)
}

function salvarUsuario(usuario){
    localStorage.setItem('usuario', JSON.stringify(usuario))
}

function obterToken(){
    return localStorage.getItem("token");
}

function obterUsuario(){
    return localStorage.getItem("usuario") || "()";
}

function sairSistema(){
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    direcionarTelaDeLogin();
}

function direcionarTelaDeLogin(){
    window.open('login.html', '_self');
}

function usuarioEstaLogado(){
    let token = obterToken();

    return !!token;
}

function validarUsuarioAutenticado(){
    let logado = usuarioEstaLogado();

    if(window.location.pathname == "/login.html"){

        if(logado){
            window.open("controle-cliente.html", '_self')
        }
    } else if(!logado && window.location.pathname == "/controle-cliente.html"){
        direcionarTelaDeLogin();
    }

}

validarUsuarioAutenticado();