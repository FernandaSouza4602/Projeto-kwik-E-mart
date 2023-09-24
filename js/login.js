let email = document.getElementById('email');
let senha = document.getElementById('senha');
let btnEntrar = document.getElementById('btn-entrar');

btnEntrar.addEventListener('click', () => {

    let userEmail = email.value;

    let userSenha = senha.value; 

    if(!userEmail || !userSenha){
        alert("Os campos de e-mail e senha são obrigatórios!");
        return;
    }

    autenticar(userEmail, userSenha);

    window.open('cliente.html', '_self')
})


function autenticar(email, senha){
    const urlBase = `http://localhost:3400`;

    fetch(`${urlBase}/login`, {
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, senha})
    })
    .then(response => response = response.json())
    .then(response => {
        if(!!response.mensagem){
            alert(response.mensagem);
            return;

        }else{

        alert("Usuario autenticado com sucesso!");

        salvarToken(response.token);
        salvarUsuario(response.usuario);
        
        window.open('cliente.html', '_self');
        }
    })
    .catch(erro => {
        console.log(erro)
    })
}

function salvarToken(token){
    localStorage.setItem('token', token)
}

function salvarUsuario(usuario){
    localStorage.setItem('usuario', JSON.stringify(usuario))
}